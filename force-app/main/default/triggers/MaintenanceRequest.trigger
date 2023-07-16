/**
 * @description       : 
 * @author            : DWS
 * @group             : 
 * @last modified on  : 07-10-2021
 * @last modified by  : DWS
 * Modifications Log 
 * Ver   Date         Author   Modification
 * 1.0   07-10-2021   DWS   Initial Version
**/
trigger MaintenanceRequest on Case (after update) {
    // call MaintenanceRequestHelper.updateWorkOrders
    Set<ID> caseIds = new Set<ID>();
    Set<ID> filteredCaseIds = new Set<ID>();
    
    for (Case c : Trigger.new) {
        caseIds.add(c.Id);
    }
    for (ID i : caseIds) {
        Case ca = Trigger.newMap.get(i);
        if (ca.Status == 'Closed' && ca.Type == 'Routine Maintenance' || ca.Type == 'Repair') {
            filteredCaseIds.add(ca.Id);
        }
    }
    //MaintenanceRequestHelper.updateWorkOrders(filteredCaseIds);  
}