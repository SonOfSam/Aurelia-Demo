using System;
using System.Threading.Tasks;

namespace AureliaDemo.Models
{
    using AureliaDemo.Services;

    using Microsoft.AspNet.Identity;    
    using Microsoft.Framework.DependencyInjection;
    using Microsoft.Framework.OptionsModel;

    public class ApplicationDbOperations
    {
        private static readonly Logger Logger = Logger.GetLogger(typeof(ApplicationDbOperations).Name);

        // The default administrator role
        const string AdminRole = "admin";
        const string UserRole = "user";

        public static async Task InitializeIdentityDbAsync(IServiceProvider serviceProvider)
        {
            using (var db = serviceProvider.GetRequiredService<ApplicationContext>())
            {
                // Create the database if it does not already exist
                Logger.Trace("InitializeIdentityDbAsync: Ensuring Database exists");
                await db.Database.EnsureCreatedAsync();

                // Create the first user if it does not already exist
                await CreateAdminUser(serviceProvider);
            }
        }

        private static async Task CreateAdminUser(IServiceProvider serviceProvider)
        {
            var options = serviceProvider.GetRequiredService<IOptions<ContextOptions>>().Options;
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

            // If the admin role does not exist, create it.
            Logger.Trace("CreateAdminUser: Ensuring Role 'admin' exists");
            if (!await roleManager.RoleExistsAsync(AdminRole))
            {
                Logger.Trace("CreateAdminUser: Role 'admin' does not exist - creating");
                var roleCreationResult = await roleManager.CreateAsync(new ApplicationRole(AdminRole));
                DumpIdentityResult("CreateAdminUser: Role Creation", roleCreationResult);
            }
            else
            {
                Logger.Trace("CreateAdminUser: Role 'admin' exists");
            }

            Logger.Trace("CreateAdminUser: Ensuring Role 'user' exists");
            if (!await roleManager.RoleExistsAsync(UserRole))
            {
                Logger.Trace("CreateAdminUser: Role 'user' does not exist - creating");
                var roleCreationResult = await roleManager.CreateAsync(new ApplicationRole(UserRole));
                DumpIdentityResult("CreateAdminUser: Role Creation", roleCreationResult);
            }
            else
            {
                Logger.Trace("CreateAdminUser: Role 'user' exists");
            }

            // if the user does not exist, create it.
            Logger.Trace($"CreateAdminUser: Ensuring User {options.DefaultAdminUserName} exists");
            var user = await userManager.FindByNameAsync(options.DefaultAdminUserName);
            if (user == null)
            {
                Logger.Trace("CreateAdminUser: User does not exist - creating");
                user = new ApplicationUser
                {
                    UserName = options.DefaultAdminUserName,
                    DisplayName = "Administrator",
                    FirstName = "Admin",
                    LastName = "Admin",
                    LockoutEnabled = false,
                    Email = "admin@email.com"
                };
                var userCreationResult = await userManager.CreateAsync(user, options.DefaultAdminPassword);
                DumpIdentityResult("CreateAdminUser: User Creation", userCreationResult);
                if (userCreationResult.Succeeded)
                {
                    Logger.Trace("CreateAdminUser: Adding new user to role admin");
                    var roleAdditionResult = await userManager.AddToRoleAsync(user, AdminRole);
                    DumpIdentityResult("CreateAdminUser: Role Addition", roleAdditionResult);
                }
            }
            else
            {
                Logger.Trace("CreateAdminUser: User already exists");
            }

            Logger.Trace("CreateUserBob: Ensuring User 'bob' exists");
            var bob = await userManager.FindByNameAsync("bob");
            if (bob == null)
            {
                Logger.Trace("CreateUserBob: User 'bob' does not exist - creating");
                user = new ApplicationUser
                {
                    UserName = "bob",
                    DisplayName = "Bob Smith",
                    FirstName = "bob",
                    LastName = "smith",
                    Email = "bobsmith@email.com"
                };
                var userCreationResult = await userManager.CreateAsync(user, options.DefaultAdminPassword);
                DumpIdentityResult("CreateUserBob: User Creation", userCreationResult);
                if (userCreationResult.Succeeded)
                {
                    Logger.Trace("CreateUserBob: Adding new user to role 'user'");
                    var roleAdditionResult = await userManager.AddToRoleAsync(user, UserRole);
                    DumpIdentityResult("CreateUserBob: Role Addition", roleAdditionResult);
                }
            }
            else
            {
                Logger.Trace("CreateUserBob: User 'bob' already exists");
            }

            Logger.Trace("CreateUserAlice: Ensuring User 'alice' exists");
            var alice = await userManager.FindByNameAsync("alice");
            if (alice == null)
            {
                Logger.Trace("CreateUserAlice: User 'alice' does not exist - creating");
                user = new ApplicationUser
                {
                    UserName = "alice",
                    DisplayName = "Alice Smith",
                    FirstName = "alice",
                    LastName = "smith",
                    Email = "alicesmith@email.com"
                };
                var userCreationResult = await userManager.CreateAsync(user, options.DefaultAdminPassword);
                DumpIdentityResult("CreateUserAlice: User Creation", userCreationResult);
                if (userCreationResult.Succeeded)
                {
                    Logger.Trace("CreateUserAlice: Adding new user to role 'user'");
                    var roleAdditionResult = await userManager.AddToRoleAsync(user, UserRole);
                    DumpIdentityResult("CreateUserAlice: Role Addition", roleAdditionResult);
                }
            }
            else
            {
                Logger.Trace("CreateUserAlice: User 'alice' already exists");
            }
        }

        private static void DumpIdentityResult(string prefix, IdentityResult result)
        {
            Logger.Trace($"{prefix}: Result = {(result.Succeeded ? "Success" : "Failed")}");
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    Logger.Trace($"--> {error.Code}: {error.Description}");
                }
            }
        }
    }

}
