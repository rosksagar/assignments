/**
 * @description       : Trigger to create new Renewal Opportunities for all 'Closed Won' Opportunities
 * @author            : Roshan
 * @group             : 
 * @last modified on  : 08-04-2021
 * @last modified by  : DWS
**/
trigger CreateRenewal on Opportunity (before update) {
    // List to store all renewal opps for bulk inserting
    List<Opportunity> renewals = new List<Opportunity>();
    String renewalRecordTypeId = Schema.SObjectType.Opportunity.getRecordTypeInfosByName().get('Renewal').getRecordTypeId();
    for (Opportunity opp : Trigger.new) {
        // Only create renewal opps for closed won deals
        if ( !opp.RecordTypeId.equals(renewalRecordTypeId) &&
             !Trigger.oldMap.get(opp.Id).StageName.equals('Closed Won') && 
             opp.StageName.equals('Closed Won')) 
        {
            renewals.add(new Opportunity(
                AccountId    = opp.AccountId,
                Name         = opp.Name +' Renewal',
                CloseDate    = opp.CloseDate + 365, // Add a year
                StageName    = 'Prospecting',
                RecordTypeId = renewalRecordTypeId,
                OwnerId      = opp.OwnerId
            ));
        }
    }
    if( !renewals.isEmpty() ) {
        try {
            Insert renewals;
        } catch(DMLException exp) {
            System.debug('Exception: '+ exp.getMessage());
        }
    }
}