/**
 * @description       : 
 * @author            : DWS
 * @group             : 
 * @last modified on  : 05-04-2021
 * @last modified by  : DWS
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   05-01-2021   DWS   Initial Version
**/
public with sharing class caseStudyController {
    public caseStudyController() {

    }

    @AuraEnabled( cacheable = true )
    public static List<Opportunity> fetchAccountOpportunities(String recordId) {
        System.debug('recordId ::'+ recordId);
        return [SELECT (Select Contact.Name, Contact.Title, Contact.LastActivityDate From OpportunityContactRoles WHERE isPrimary = TRUE), 
            Amount, StageName, Probability, CloseDate, Notes__c //, RecordType.Name 
            FROM Opportunity 
            WHERE AccountId = :recordId ];
    }
}