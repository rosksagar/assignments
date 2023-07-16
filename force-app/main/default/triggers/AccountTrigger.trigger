trigger AccountTrigger on Account (after insert, after update) {
    List<Account> grantParentAccounts = new List<Account>();
    for( Account acc : [SELECT Parent.ParentId FROM Account WHERE Id IN :Trigger.new] ) {
        if( !String.isEmpty(acc.ParentId) && !String.isEmpty(acc.Parent.ParentId) ) {
            grantParentAccounts.add(new Account(
                Id = acc.Parent.ParentId,
                Interest__c = 'Yes'
            ));
        }
    }
    if( grantParentAccounts.size() > 0 ) {
        Update grantParentAccounts;
    }
}