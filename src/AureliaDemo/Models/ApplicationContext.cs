namespace AureliaDemo.Models
{
    using Microsoft.Data.Entity;

    public class ApplicationContext : DbContext
    {
        public DbSet<Application> Applications { get; set; }
    }
}