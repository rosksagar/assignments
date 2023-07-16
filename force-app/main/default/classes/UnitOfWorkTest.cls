@isTest
public class UnitOfWorkTest {
    
    @isTest
    static void challengeComplete() {
        // Create a Unit Of Work
        fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(
            new Schema.SObjectType[] {
                Account.SObjectType,
                Contact.SObjectType,
                Note.SObjectType
            }
        );

        // Do some work!
        for(Integer o = 0; o < 100; o++) {
            Account acc = new Account();
            acc.Name = 'UoW Test Name ' + o;
            uow.registerNew(acc);
            for(Integer i = 0; i < 5; i++) {
                Contact con = new Contact();
                con.FirstName = acc.Name + ' : FN : ' + i;
                con.LastName = acc.Name + ' : LN : ' + i;
                uow.registerRelationship(con, Contact.AccountId, acc);
                uow.registerNew(con);
                
                Note nt = new Note();
                nt.Title = acc.Name + ' : Title : ' + i;
                uow.registerRelationship(nt, Note.ParentId, acc);
                uow.registerNew(nt);
            }
        }
        // Commit the work to the database!
        uow.commitWork();
        
        System.assertEquals(100, [Select Id from Account].size());
        System.assertEquals(500, [Select Id from Contact].size());
        System.assertEquals(500, [Select Id from Note].size());
    }
}