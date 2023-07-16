/**
 * @description       : 
 * @author            : DWS
 * @group             : 
 * @last modified on  : 07-01-2021
 * @last modified by  : DWS
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   07-01-2021   DWS      Initial Version
**/
global class RecordDeleter implements Database.Batchable<sObject>, Schedulable {
    
    static Date today5 = Date.today().addDays(-5);

    public Database.QueryLocator start(Database.BatchableContext context) {
        return Database.getQueryLocator('SELECT ID FROM Contact WHERE CreatedDate < :today5');
    }

    public void execute(Database.BatchableContext context, List<SObject> records) {
        try {
            DELETE records;
        } catch(Exception exp) {
            System.debug('Exception : '+ exp.getMessage());
        }
    }

    public void finish(Database.BatchableContext bc) { }
    
    global void execute(SchedulableContext ctx)  {
        Database.executeBatch(new RecordDeleter());
    }
}