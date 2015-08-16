namespace AureliaDemo.Models
{
    using Microsoft.AspNet.Identity.EntityFramework;

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
    {
    }
}
