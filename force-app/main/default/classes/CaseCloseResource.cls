@RestResource(urlMapping='/case/*/close')
global with sharing class CaseCloseResource {
    @HttpPost
    global static void closeCase(String caseCloseReason) {
        // Parse context
        RestRequest req = RestContext.request;
        String[] uriParts = req.requestURI.split('/');
        System.debug('uriParts:'+ uriParts);
        Id caseId = uriParts[2];
        System.debug('Id:'+ caseId);
        // Call the service
        CaseService.closeCases(new Set<Id> { caseId }, caseCloseReason);     
    }
}