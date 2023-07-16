/**
 * @Description : Controller for Login page that exposes the All site login functionality.
 * @CreatedDate : 09-09-2018
 */
public class SiteSignInController extends SiteBaseClass {
  
    public String username { get; set; }
    public String password { get; set; }
        
    /**
     * @Purpose : Login to the active site.
     * @Return  : PageReference
    */
    public PageReference login() {  
        
        PageReference reference;
              
        if( String.isNotBlank( username ) &&
            String.isNotBlank( password ) ) {
            
            reference = Site.login(username, password, '/s/');
        } else {
            isMsgShow = true;
            msgType = 'Error'; 
            pageMsg = 'Please enter username and password..!';
        }
        return reference;
    }
}