import { track, api, LightningElement } from 'lwc';
import fetchAccountOpportunities from '@salesforce/apex/caseStudyController.fetchAccountOpportunities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Contact Name', fieldName: 'contactName' },
    { label: 'Title', fieldName: 'contactTitle' },
    { label: 'Last Activity Date', fieldName: 'contactLastActivityDate', type: 'date' },
    { label: 'Amount', fieldName: 'Amount', type: 'currency' },
    { label: 'Stage', fieldName: 'StageName' },
    {
        label: 'Probability', fieldName: 'Probability', type: 'percent', cellAttributes: {
            class: { fieldName: 'StageClass' }
        }, typeAttributes: {
            step: '0.01', minimumFractionDigits: '2', maximumFractionDigits: '3'
        }
    },
    { label: 'Notes', fieldName: 'Notes__c', editable: true }
];

export default class CaseStudy extends LightningElement {

    @api recordId;
    @track baseOpportunities;
    @track error;
    @track columns = columns;
    get options() {
        return [
            { label: 'Asc', value: 'asc' },
            { label: 'Desc', value: 'desc' },
        ];
    }
    @track opportunities;
    sortedBy;
    defaultSortDirection = 'desc';
    sortDirection = 'desc';
    selectedRows = [];
    saveDraftValues = [];

    // Used to sort the column
    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                return primer(x[field]);
            }
            : function (x) {
                return x[field];
            };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    handleKeyChange(event) {
        if (this.baseOpportunities) {
            const searchKey = event.target.value;
            if (searchKey) {
                const cloneData = [...this.baseOpportunities];
                this.opportunities = cloneData.filter(row => row.StageName.indexOf(searchKey) >= 0);
            } else {
                this.opportunities = this.baseOpportunities;
            }
        }
    }

    // eslint-disable-next-line @lwc/lwc/no-async-await
    connectedCallback() {
        console.log(this.recordId);
        if (this.recordId) {
            fetchAccountOpportunities({ 'recordId': this.recordId })
                .then(result => {
                    this.opportunities = JSON.parse(JSON.stringify(result));
                    this.opportunities.forEach(element => {
                        if (element.Probability <= 25) {
                            element.StageClass = 'slds-theme--error';
                        } else if (element.Probability <= 50) {
                            element.StageClass = 'slds-theme--info';
                        } else if (element.Probability <= 75) {
                            element.StageClass = 'slds-theme--warning';
                        } else {
                            element.StageClass = 'slds-theme--success';
                        }
                        element.Probability = element.Probability / 10;
                        let contact = element.OpportunityContactRoles[0] ? element.OpportunityContactRoles[0].Contact : {};
                        if (contact) {
                            element.contactName = contact.Name;
                            element.contactTitle = contact.Title;
                            element.contactLastActivityDate = contact.LastActivityDate;
                        }
                    });
                    this.baseOpportunities = this.opportunities;
                })
                .catch(error => {
                    this.opportunities = undefined;
                    this.error = error;
                });
        }
    }

    sortByCloseDate(event) {
        if (this.opportunities) {
            //const { fieldName: sortedBy, sortDirection } = event.detail;
            const cloneData = [...this.opportunities];
            //cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
            console.log(event.target.value);
            cloneData.sort(this.sortBy('CloseDate', event.target.value === 'asc' ? 1 : -1));
            this.opportunities = cloneData;
            this.sortDirection = event.target.value;
            this.sortedBy = 'CloseDate';
        }
    }

    handleSave(event) {

        this.saveDraftValues = event.detail.draftValues;
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        console.log(recordInputs);
        // Updateing the records using the UiRecordAPi
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            //this.saveDraftValues = [];
            //this.connectedCallback();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        }).finally(() => {
            //this.saveDraftValues = [];
            //this.connectedCallback();
        });
    }
}