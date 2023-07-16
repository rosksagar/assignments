trigger LineItemTrigger on OpportunityLineItem (after insert) {
    List<Opportunity> opps = new List<Opportunity>();
    for(OpportunityLineItem oit : [SELECT OpportunityId 
                                   FROM OpportunityLineItem 
                                   WHERE OpportunityId !='' AND 
                                   		 Id IN :Trigger.New AND 
                                   		 Product2.Family = 'Sponsor']) {
        opps.add(new Opportunity(
            Id = oit.OpportunityId,
            type = 'Sponsor'
        ));
    }
    if( opps.size() > 0 ) {
        Update opps;
    }
}