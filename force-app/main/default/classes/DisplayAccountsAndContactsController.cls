public class DisplayAccountsAndContactsController {
	@AuraEnabled
    public static string getAccountsAndContacts() {
        List<List<sObject>> accAndContacts = [FIND 'Inc' RETURNING Account(Name, AccountSource, NumberOfEmployees), Contact(Name, CleanStatus, Birthdate) LIMIT 10];
        return JSON.serialize(accAndContacts);
    }
}