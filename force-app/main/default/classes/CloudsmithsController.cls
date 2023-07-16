/**
 * @description       :
 * @author            : Roshan
 * @group             :
 * @last modified on  : 07-17-2023
 * @last modified by  : Roshan
 * Modifications Log
 * Ver   Date         Author    Modification
 * 1.0   07-10-2023   Roshan    Initial Version
 **/
public with sharing class CloudsmithsController {
    @AuraEnabled
    public static Object getAnalysisRecordBySaid(String said) {
        List<SAID_Analysis__c> analysis;
        System.debug(said);
        try {
            analysis = [
                SELECT Id, Birthdate__c, SAID__c, Gender__c, SA_Citizen__c, Permanent_Resident__c, Search_Count__c
                FROM SAID_Analysis__c
                WHERE SAID__c = :said
                WITH SECURITY_ENFORCED
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return analysis.size() > 0 ? analysis[0] : null;
    }
}
