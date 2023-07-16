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
public with sharing class SearchRecordsController {
    public String searchboxstring { get; set; }
    public List<List<SObject>> result { get; set; }
    
    public SearchRecordsController() {
        result = new List<List<SObject>>();
    }

    public void searchbox() {
        //result = [select ID,Name, account.name from Contact where account.Name =:searchboxstring];
        result = [FIND :searchboxstring IN NAME FIELDS RETURNING Account(Name), Contact(Name)];
    }
}