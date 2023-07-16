public class displayTasksController {
    
    @AuraEnabled
    public static string getContacts(String searchStr) {
        List<Contact> contacts = new List<Contact>();
        if( !String.isEmpty(searchStr) ) {
            String tempSearchStr = '%'+ searchStr +'%';
            contacts = [SELECT FirstName, LastName, Email FROM Contact WHERE Name LIKE :tempSearchStr];
        }
        return JSON.serialize(contacts);
    }
    
    @AuraEnabled
    public static string getAccountOppoutunityTasks(String AccountId) {
        List<Task> tasks = [SELECT Subject FROM Task WHERE whatid IN (SELECT Id FROM Opportunity WHERE AccountId =:AccountId)];
        return JSON.serialize(tasks);
    }
    
    @AuraEnabled
    public static boolean deleteTask(String TaskId) {
        Task t = new task(Id = TaskId);
        try {
            delete t;
        } catch(exception exp) {
            return false;
        }
        return true;
    }
}