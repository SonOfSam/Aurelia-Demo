namespace AureliaDemo.Models
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class ApplicationUserStore : UserStore<ApplicationUser, ApplicationRole, ApplicationDbContext, int>
    {
        public ApplicationUserStore(ApplicationDbContext context, IdentityErrorDescriber describer = null)
            : base(context, describer)
        {            
        }
    }
}
