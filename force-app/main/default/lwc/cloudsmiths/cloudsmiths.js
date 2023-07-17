import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getRecordBySaid from "@salesforce/apex/CloudsmithsController.getAnalysisRecordBySaid";
import { updateRecord, createRecord } from "lightning/uiRecordApi";
import SAID_Analysis_Object from "@salesforce/schema/SAID_Analysis__c";

class URLBuilder {
    constructor() {
        this.domain = "";
        this.resource = "";
        this.attributes = {};
        this.url = "";
    }
    constructUtl() {
        this.url = this.domain + this.resource;
        Object.keys(this.attributes).forEach((key, index) => {
            if (key) {
                this.url += (index === 0 ? "?" : "&") + key + "=" + this.attributes[key];
            }
        });
        return this;
    }
    setDomain(domain) {
        this.domain = domain;
        return this.constructUtl();
    }
    setResource(resource) {
        this.resource = resource;
        return this.constructUtl();
    }
    setAttribute(key, value) {
        this.attributes[key] = value;
        return this.constructUtl();
    }
}

class SearchAnalysisBuilder {
    constructor(...args) {
        if (args[0]) {
            this.Id = args[0].Id;
            this.Birthdate__c = new Date(args[0].Birthdate__c);
            this.SAID__c = args[0].SAID__c;
            this.Gender__c = args[0].Gender__c;
            this.SA_Citizen__c = args[0].SA_Citizen__c;
            this.Permanent_Resident__c = args[0].Permanent_Resident__c;
            this.Search_Count__c = parseInt(args[0].Search_Count__c, 10);
        } else {
            this.Birthdate__c = new Date();
            this.SAID__c = "";
            this.Gender__c = "";
            this.SA_Citizen__c = false;
            this.Permanent_Resident__c = false;
            this.Search_Count__c = 1;
        }
    }
    setBirthDate(Birthdate__c) {
        this.Birthdate__c = Birthdate__c;
        return this;
    }
    setSaid(SAID__c) {
        this.SAID__c = SAID__c;
        return this;
    }
    setGender(Gender__c) {
        this.Gender__c = Gender__c;
        return this;
    }
    setSACitizen(SA_Citizen__c) {
        this.SA_Citizen__c = SA_Citizen__c;
        return this;
    }
    setPermanentResident(Permanent_Resident__c) {
        this.Permanent_Resident__c = Permanent_Resident__c;
        return this;
    }
    setSearchCount(Search_Count__c) {
        this.Search_Count__c = Search_Count__c;
        return this;
    }
}

export default class Cloudsmiths extends LightningElement {
    calendarific_domain = "https://calendarific.com/api/v2";
    calendarific_holiday_resource = "/holidays";
    calendarific_api_key = "ec00cc30ee4bcd3f1a3d76841c25e9316fff5f7a";
    calendarific_country = "in";
    calendarific_century = "20";

    SAID_LENGTH = 13;
    fixed12thDigit = "8";

    formattedBirthDate;
    formattedGenderValue = "5000";
    isSACitizen = true;

    saidForSearch;
    doneWithSaidSearch;
    holidayTableHeader;

    calendarific_data;

    saidAnalysisRecord;

    get calendarific_columns() {
        return [
            { label: "Date", fieldName: "new_date", type: "date", fixedWidth: 150 },
            { label: "Name", fieldName: "name", fixedWidth: 250 },
            { label: "Description", fieldName: "description" }
        ];
    }

    get genderOptions() {
        return [
            { label: "Men", value: "MEN" },
            { label: "Women", value: "WOMEN" }
        ];
    }

    get generatedSAID() {
        let formattedSAID = "";
        formattedSAID += this.formattedBirthDate ? this.formattedBirthDate : "000000";
        formattedSAID += this.formattedGenderValue ? this.formattedGenderValue : "0000";
        formattedSAID += this.isSACitizen ? "1" : "0";
        formattedSAID += this.fixed12thDigit;
        formattedSAID += this.getLastDigitFromLuhnAlgorithm(formattedSAID);
        return formattedSAID;
    }

    get isValidSaidLength() {
        return this.saidForSearch && this.saidForSearch.length === 13;
    }

    get isSearchDisabled() {
        return !this.isValidSaidLength;
    }

    get isValidSAID() {
        return this.checkLuhn(this.saidForSearch);
    }

    get saidBirthDate() {
        let birthDate;
        if (this.saidForSearch) {
            let strDt = this.saidForSearch.substring(0, 6);
            try {
                birthDate = new Date(
                    this.calendarific_century + strDt.substring(0, 2),
                    parseInt(strDt.substring(2, 4), 10) - 1,
                    strDt.substring(4, 6)
                );
            } catch (error) {
                this.showNotification({
                    title: "Error",
                    message: JSON.stringify(error),
                    variant: "error"
                });
            }
        }
        return birthDate;
    }

    get saidGender() {
        let gender;
        if (this.saidForSearch) {
            let genderInt = parseInt(this.saidForSearch.substring(6, 10), 10);
            gender = genderInt < 5000 ? "Women" : "Men";
        }
        return gender;
    }

    get saidCitizenship() {
        let citizenship;
        if (this.saidForSearch) {
            let citizenshipInt = parseInt(this.saidForSearch.substring(10, 11), 10);
            citizenship = citizenshipInt ? "SA citizen" : "Permanent Resident";
        }
        return citizenship;
    }

    get showHolidayTable() {
        return this.calendarific_data.length > 0;
    }

    // Luhn Pattern we implemented 2,1,2,1,...
    getLuhnSum(said) {
        let nDigits = said.length;
        let sum = 0;
        for (let i = nDigits - 1; i >= 0; i--) {
            let d = parseInt(said[i], 10);
            if (!(i % 2)) d = d * 2;
            // We add two digits to handle cases that make two digits after doubling
            let dSum = parseInt(d / 10, 10) + parseInt(d % 10, 10);
            sum += dSum;
        }
        return sum;
    }

    getLastDigitFromLuhnAlgorithm(said) {
        let sum = this.getLuhnSum(said);
        let lastDigit = 0;
        for (let i = 1; i <= 9; i++) {
            let d = i * 2;
            let dSum = parseInt(d / 10, 10) + parseInt(d % 10, 10);
            if ((sum + dSum) % 10 === 0) {
                lastDigit = i;
                break;
            }
        }
        // console.log(sum);
        // console.log(lastDigit);
        return lastDigit;
    }

    checkLuhn(said) {
        let sum = this.getLuhnSum(said);
        // console.log(sum);
        return sum !== 0 && parseInt(sum, 10) % 10 === 0;
    }

    resetData() {
        this.doneWithSaidSearch = false;
        this.calendarific_data = [];
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    showNotification(notification) {
        const evt = new ShowToastEvent(notification);
        this.dispatchEvent(evt);
    }

    processFetchedData(data) {
        if (data.meta.code === 200) {
            if (data.response.holidays.length) {
                data.response.holidays.forEach((row) => {
                    row.new_date = new Date(row.date.iso);
                });
            }
            return data.response.holidays;
        }
        return [];
    }

    async updateAnalysisRecord(record) {
        try {
            await updateRecord({
                fields: record
            });
            // console.log("Record Saved");
        } catch (error) {
            this.showNotification({
                title: "Error",
                message: JSON.stringify(error),
                variant: "error"
            });
        }
    }

    async createAnalysisRecord(record) {
        try {
            await createRecord({
                apiName: SAID_Analysis_Object.objectApiName,
                fields: record
            });
            // console.log("Record Created");
        } catch (error) {
            this.showNotification({
                title: "Error",
                message: JSON.stringify(error),
                variant: "error"
            });
        }
    }

    handleSaidForSearchChange(event) {
        this.resetData();
        if (!isNaN(event.target.value)) {
            this.saidForSearch = event.target.value;
        }
    }

    handleBirthdateChange(event) {
        let dt = new Date(event.target.value);
        this.formattedBirthDate = (dt.getFullYear() + "").split("").splice(2, 3).join("");
        this.formattedBirthDate += ("" + (dt.getMonth() + 1)).padStart(2, "0");
        this.formattedBirthDate += ("" + dt.getDate()).padStart(2, "0");
        this.calendarific_century = (dt.getFullYear() + "").split("").splice(0, 2).join("");
        // console.log(this.formattedBirthDate);
    }

    handleGenderOption(event) {
        // console.log(event.target.value);
        switch (event.target.value) {
            case "MEN":
                this.formattedGenderValue = "" + this.getRandomInt(5000, 9999);
                break;
            case "WOMEN":
                this.formattedGenderValue = "" + this.getRandomInt(0, 4999);
                break;
            default:
                break;
        }
    }

    handleCitizenship(event) {
        this.isSACitizen = event.target.checked;
    }

    async handleSaidSearch() {
        this.doneWithSaidSearch = false;
        if (this.isValidSAID) {
            this.doneWithSaidSearch = true;
            let saidAnalysisRecord = new SearchAnalysisBuilder(await getRecordBySaid({ said: this.saidForSearch }));
            // console.log(saidAnalysisRecord);
            if (saidAnalysisRecord && saidAnalysisRecord.Id) {
                // Update Record
                saidAnalysisRecord.setSearchCount(saidAnalysisRecord.Search_Count__c + 1);
                await this.updateAnalysisRecord(saidAnalysisRecord);
            } else {
                // Create Record
                saidAnalysisRecord.setSaid(this.saidForSearch);
                saidAnalysisRecord.setBirthDate(this.saidBirthDate);
                saidAnalysisRecord.setGender(this.saidGender);
                saidAnalysisRecord.setSACitizen(this.saidCitizenship === "SA citizen");
                saidAnalysisRecord.setPermanentResident(this.saidCitizenship === "Permanent Resident");
                await this.createAnalysisRecord(saidAnalysisRecord);
            }
            // Run Fetch for get Birth-Day Holidays
            await this.handleBirthdateHolidayCheck();
        } else {
            this.showNotification({
                title: "Error",
                message: "Given SAID is Invlid!",
                variant: "error"
            });
        }
    }

    async handleBirthdateHolidayCheck() {
        if (this.saidBirthDate) {
            this.holidayTableHeader = "Check what all holidays are on birthdate.";
            let year = this.saidBirthDate.getFullYear();
            let month = this.saidBirthDate.getMonth() + 1;
            let day = this.saidBirthDate.getDate();
            let urlBuilder = new URLBuilder()
                .setDomain(this.calendarific_domain)
                .setResource(this.calendarific_holiday_resource)
                .setAttribute("api_key", this.calendarific_api_key)
                .setAttribute("country", this.calendarific_country)
                .setAttribute("year", year)
                .setAttribute("month", month)
                .setAttribute("day", day);
            fetch(urlBuilder.url)
                .then((response) => response.json())
                .then((data) => {
                    this.calendarific_data = this.processFetchedData(data);
                });
        }
    }

    handleYearHolidayCheck() {
        if (this.saidBirthDate) {
            this.holidayTableHeader = "Check what all holidays are in birth year.";
            let year = this.saidBirthDate.getFullYear();
            let urlBuilder = new URLBuilder()
                .setDomain(this.calendarific_domain)
                .setResource(this.calendarific_holiday_resource)
                .setAttribute("api_key", this.calendarific_api_key)
                .setAttribute("country", this.calendarific_country)
                .setAttribute("year", year);
            fetch(urlBuilder.url)
                .then((response) => response.json())
                .then((data) => {
                    this.calendarific_data = this.processFetchedData(data);
                });
        }
    }
}
