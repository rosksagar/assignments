/**
 * An apex page controller that supports self registration of users in communities that allow self registration
 */
public class SiteSignUpController extends SiteBaseClass {

    public String firstName             { get; set; }
    public String lastName              { get; set; }
    public String email                 { get; set; }
    public String company               { get; set; }
    public String password              { get; set { password = value == null ? value : value.trim(); } }
    public String confirmPassword       { get; set { confirmPassword = value == null ? value : value.trim(); } }
    public String communityNickname     { get; set { communityNickname = value == null ? value : value.trim(); } }
    
    public SiteSignUpController() {
        String expid = ApexPages.currentPage().getParameters().get('expid');            
        if (expId != null) {
            Site.setExperienceId(expId); 
        }    
    }
    
    private boolean isValidPassword() {
        return password == confirmPassword;
    }

    public PageReference registerUser() {
    
        if( String.isNotBlank( firstName ) &&
            String.isNotBlank( lastName ) &&
            String.isNotBlank( email ) &&
            String.isNotBlank( company ) &&
            String.isNotBlank( password ) &&
            String.isNotBlank( confirmPassword ) &&
            String.isNotBlank( communityNickname ) ) {        
        
            // it's okay if password is null - we'll send the user a random password in that case
            if ( !isValidPassword() ) {
                isMsgShow = true;
                msgType = 'Error'; 
                pageMsg = 'Password Don\'t Match..!';
                return null;
            }
            
            String profileId = getProfileId('EAG-Community User');
            String roleEnum = null; // To be filled in by customer.        
            String accountId = getAccountId(company);        
            
            if( String.isBlank(profileId) || String.isBlank(accountId) ) {
                isMsgShow = true;
                msgType = 'Error'; 
                pageMsg = 'Something Wrong! Please Contact Admin!!';
                return null;
            }
            
            String userName = email;
    
            User u = new User();
            u.Username = userName;
            u.Email = email;
            u.FirstName = firstName;
            u.LastName = lastName;
            u.CommunityNickname = communityNickname;
            u.ProfileId = profileId;
        
            String userId;
    
            try {
                //userId = Site.createExternalUser(u, accountId, password, true);
            } catch(Site.ExternalUserCreateException ex) {
                List<String> errors = ex.getDisplayMessages();
                isMsgShow = true;
                msgType = 'Error'; 
                pageMsg = errors[0];                
                System.debug(ex.getMessage());
            }
            
            if (userId != null) { 
                if (password != null && password.length() > 1) {
                    return Site.login(userName, password, ApexPages.currentPage().getParameters().get('startURL'));
                }
                else {
                    PageReference page = System.Page.CommunitiesSelfRegConfirm;
                    page.setRedirect(true);
                    return page;
                }
            }
        } else {
            isMsgShow = true;
            msgType = 'Error'; 
            pageMsg = 'Please Fill All fields Mandatory..!';
        }
        return null;
    }
    
    private String getAccountId(String company) {
        // Fetch Account Id for Community User.
        List<Account> accList = new List<Account>([SELECT Id FROM Account WHERE Name = :company LIMIT 1]);
        String accountId = '';
        if( accList.isEmpty() ) {
            Account acc = new Account(Name=company);
            try { 
                insert acc;
                accountId = acc.id;
            } catch(Exception exp) {
                isMsgShow = true;
                msgType = 'Error'; 
                pageMsg = 'Something Wrong! Please Contact Admin!!';
                System.debug('Exception while create new Account : ' + exp.getMessage());
                return null;
            }            
        } else {
            accountId = accList[0].id;
        }
        return accountId;
    }
    
    private String getProfileId(String prfName) {
        // Fetch Profile Id for Community User.
        List<Profile> profileList = [SELECT Id FROM Profile WHERE Name = :prfName LIMIT 1];
        String profileId = '';
        if( profileList.isEmpty() ) {
            isMsgShow = true;
            msgType = 'Error'; 
            pageMsg = 'Something Wrong! Please Contact Admin!!';
            return null;
        } else {
            profileId = profileList[0].id;
        }
        return profileId;
    }
}