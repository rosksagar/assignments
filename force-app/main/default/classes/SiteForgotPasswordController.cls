/**
 * An apex page controller that exposes the site forgot password functionality
 */
public with sharing class SiteForgotPasswordController extends SiteBaseClass {
    
    public String username { get; set; }
       
    public SiteForgotPasswordController() {}
    
    public PageReference forgotPassword() {
        PageReference pr = null;
        if( String.isNotBlank( username ) ) {            
            boolean success = Site.isValidUsername(username);
            if(success) {              
                if( Site.forgotPassword(username) ) {
                    pr = Page.LoginPage;
                    pr.setRedirect(true);
                }                
            } else {
                isMsgShow = true;
                msgType = 'Error'; 
                pageMsg = 'Username Dose Not Exist..!';
            }
        } else {
            isMsgShow = true;
            msgType = 'Error'; 
            pageMsg = 'Please Enter Username..!';
        }
        return pr;
    }
}