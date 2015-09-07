namespace AureliaDemo.Models
{
    using Microsoft.AspNet.Identity.EntityFramework;
    using Microsoft.Data.Entity;

    public class ApplicationContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
    {
        public DbSet<Application> Applications { get; set; }
    }
}