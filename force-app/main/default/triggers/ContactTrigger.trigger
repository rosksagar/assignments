/**
 * @description       : 
 * @author            : DWS
 * @group             : 
 * @last modified on  : 08-12-2021
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   07-01-2021   DWS   Initial Version
**/
trigger ContactTrigger on Contact (after insert, after update, after delete, after undelete) {
    set<String> accountIds = new set<String>();
    for(Contact con : trigger.new) {
        accountIds.add(con.AccountId);
    }
    for(Contact con : trigger.old) {
        accountIds.add(con.AccountId);
    }

    List<Account> accounts = new List<Account>();
    if( !accountIds.isEmpty() ) {
        for(Account acc : [SELECT (SELECT id FROM Contacts) FROM Account WHERE Id IN :accountIds ]) {
            accounts.add(new Account(
                Id = acc.Id,
                Description = 'it has '+ acc.contacts.size() + ' Contacts.'
            ));
        }
    }
    if( !accounts.isEmpty() ) {
        Update accounts;
    }
    /*
    Set<String> accountIds = new Set<String>();
    for( Contact cont : Trigger.new ) {
        if( String.isNotEmpty(cont.AccountId) ) {
            accountIds.add(cont.AccountId);
        }
    }
    Map<String, Account> accountsMap = new Map<String, Account>(
        [SELECT Id FROM Account WHERE Id IN :accountIds]
    );
    for( Contact cont : Trigger.new ) {
        if( String.isNotEmpty(cont.AccountId) ) {
            //cont.BillingStreet = accountsMap.get(cont.AccountId).ShippingStreet;
            //cont.BillingCity = accountsMap.get(cont.AccountId).ShippingCity;
            //cont.BillingState = accountsMap.get(cont.AccountId).ShippingState;
            //cont.BillingPostalCode = accountsMap.get(cont.AccountId).ShippingPostalCode;
            //cont.BillingCountry = accountsMap.get(cont.AccountId).ShippingCountry;
        }
    }*/
}