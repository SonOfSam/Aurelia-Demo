namespace AureliaDemo.Models
{
    using Microsoft.AspNet.Identity.EntityFramework;

    public class ApplicationRole : IdentityRole<int>
    {
        public ApplicationRole(string roleName) : base(roleName)
        {
        }
    }
}