namespace AureliaDemo.Models
{
    using Microsoft.AspNet.Identity.EntityFramework;

    public class ApplicationUser : IdentityUser<int>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string DisplayName { get; set; }
    }
}
