namespace AureliaDemo.Models
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class ApplicationRoleStore : RoleStore<ApplicationRole, ApplicationContext, int>
    {
        public ApplicationRoleStore(ApplicationContext context, IdentityErrorDescriber describer = null)
            : base(context, describer)
        {
        }
    }
}
