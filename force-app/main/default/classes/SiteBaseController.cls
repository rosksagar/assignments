/**
 * @Description : Controller for Login page that exposes the All site login functionality.
 * @CreatedDate : 09-09-2018
 */
public class SiteBaseController extends SiteBaseClass{
  
    public Boolean isLoginShow { get; set; }
    public Boolean isSignUpShow { get; set; }
    public Boolean isForgotPasswordShow { get; set; }    
    
    public SiteBaseController() {
        isLoginShow = true;
    }  
}