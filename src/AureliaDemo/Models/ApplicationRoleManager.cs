namespace AureliaDemo.Models
{
    using System.Collections.Generic;

    using Microsoft.AspNet.Hosting;
    using Microsoft.AspNet.Identity;
    using Microsoft.Framework.Logging;

    public class ApplicationRoleManager : RoleManager<ApplicationRole>
    {
        public ApplicationRoleManager(IRoleStore<ApplicationRole> store, IEnumerable<IRoleValidator<ApplicationRole>> roleValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, ILogger<RoleManager<ApplicationRole>> logger, IHttpContextAccessor contextAccessor)
            : base(store, roleValidators, keyNormalizer, errors, logger, contextAccessor)
        {
        }        
    }
}
