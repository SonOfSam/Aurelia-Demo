namespace AureliaDemo.Models
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class ApplicationUserStore : UserStore<ApplicationUser, ApplicationRole, ApplicationContext, int>
    {
        public ApplicationUserStore(ApplicationContext context, IdentityErrorDescriber describer = null)
            : base(context, describer)
        {
        }
    }
}
