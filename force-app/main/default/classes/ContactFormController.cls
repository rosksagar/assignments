/**
 * @description       : Controller class for ContactForm LC.
 * @author            : Roshan
 * @group             : 
 * @last modified on  : 05-30-2021
 * @last modified by  : DWS
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   05-30-2021   Roshan   Initial Version
**/
public with sharing class ContactFormController {
    
    @AuraEnabled
    public static string getContacts() {
        ResultWrapper finalResult = new ResultWrapper( false, null, null);
        try {
            List<Contact> conatcts = [SELECT Name, Email, Account.Name FROM Contact WHERE CreatedDate = TODAY ORDER By CreatedDate DESC];
            finalResult.success = true;
            finalResult.result = conatcts;
        } catch (Exception e) {
            finalResult.success = true;
            throw new AuraHandledException(e.getMessage());
        }
        return JSON.serialize(finalResult);
    }

    @AuraEnabled
    public static string saveContacts(String JSONContacts) {
        ResultWrapper finalResult = new ResultWrapper( false, null, null);
        if( String.isNotBlank(JSONContacts) ) {
            try {
                List<Contact> newContacts = (List<Contact>) JSON.deserialize(JSONContacts, List<Contact>.class);
                if( newContacts.size() > 0 ) {
                    System.debug(newContacts);
                    Map<String, Set<String>> accountIdToEmailsMap = new Map<String, Set<String>>();
                    for( Contact cont : newContacts ) {
                        if( !accountIdToEmailsMap.containsKey(cont.AccountId) ) {
                            accountIdToEmailsMap.put(cont.AccountId, new Set<string>());
                        }
                        accountIdToEmailsMap.get(cont.AccountId).add(cont.Email);
                    }
                    for(Contact cont : [SELECT AccountId, Email FROM Contact WHERE AccountId IN :accountIdToEmailsMap.keySet()]) {
                        if( accountIdToEmailsMap.get(cont.AccountId).contains(cont.Email) ) {
                            throw new AccountContactEmailException('Contact-Emails under Account must be Unique : ['+ cont.Email +']');
                        }
                    }
                    Insert newContacts;
                    finalResult.success = true;
                    finalResult.message = 'Contacts Inserted';
                } else {
                    finalResult.message = 'No Contact Record Found!';
                }
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        } else {
            finalResult.message = 'Something Wrong! Please Contact Admin.';
        }
        return JSON.serialize(finalResult);
    }

    public class AccountContactEmailException extends Exception {}

    public class ResultWrapper {
        public Boolean success;
        public String message;
        public Object result;
        public ResultWrapper(Boolean success, String message, Object result) {
            this.success = success;
            this.message = message;
            this.result = result;
        }
    }
}