public with sharing class CaseService {
   public static void closeCases(Set<Id> caseIds, String caseCloseReason) {
        // Validate parameters
        if(caseIds == null || caseIds.size() == 0)
            throw new CaseServiceException('Cases not specified.');
        // Query Case and Lines (SOQL inlined for this example, see Selector pattern in later module)
        List<Case> cases = [SELECT Reason, Status FROM Case WHERE Id IN :caseIds];
        // Update Cases and Lines (if present)
        List<Case> casesToUpdate = new List<Case>();
        for(Case cs : cases) {
            //cs.Comments = caseCloseReason;
            cs.Reason = caseCloseReason;
            cs.Status = 'Closed';
            casesToUpdate.add(cs);
        }
        // Update the database
        SavePoint sp = Database.setSavePoint();
        try {
            update casesToUpdate;
        } catch (Exception e) {
            // Rollback
            Database.rollback(sp);
            // Throw exception on to caller
            throw e;
        }       
    }
    
    public class CaseServiceException extends Exception {} 
}