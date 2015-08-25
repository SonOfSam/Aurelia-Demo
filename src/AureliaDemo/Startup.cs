namespace AureliaDemo
{
    using System.Security.Cryptography.X509Certificates;

    using AureliaDemo.Configuration;
    using AureliaDemo.IdentityServerItems;
    using AureliaDemo.Models;

    using IdentityServer3.Core.Configuration;
    using IdentityServer3.Core.Services;

    using Microsoft.AspNet.Builder;
    using Microsoft.AspNet.Diagnostics;
    using Microsoft.AspNet.Hosting;
    using Microsoft.AspNet.Identity;
    using Microsoft.Data.Entity;
    using Microsoft.Framework.Configuration;
    using Microsoft.Framework.DependencyInjection;
    using Microsoft.Framework.Runtime;

    public class Startup
    {
        public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
        {
            var builder = new ConfigurationBuilder(appEnv.ApplicationBasePath)
                .AddJsonFile("config.json")
                .AddJsonFile($"config.{env.EnvironmentName}.json", optional: true);

            this.Configuration = builder.Build();
        }

        #region Properties

        public IConfiguration Configuration { get; set; }

        #endregion //Properties
        
        public void ConfigureServices(IServiceCollection services)
        {            

            //// Add Entity Framework services to the services container.
            services.AddEntityFramework()
                .AddSqlServer()
                .AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(this.Configuration["Data:DefaultConnection:ConnectionString"]));


            services.Configure<IdentityDbContextOptions>(options =>
            {
                options.DefaultAdminUserName = this.Configuration.Get("AdminUser:Username");
                options.DefaultAdminPassword = this.Configuration.Get("AdminUser:Password");
            });

            services.TryAdd(ServiceDescriptor.Scoped<IUserStore<ApplicationUser>, ApplicationUserStore>());
            services.TryAdd(ServiceDescriptor.Scoped<IRoleStore<ApplicationRole>, ApplicationRoleStore>());
            services.TryAdd(ServiceDescriptor.Scoped<RoleManager<ApplicationRole>, ApplicationRoleManager>());

            //// Add Identity services to the services container.
            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddUserStore<ApplicationUserStore>()
                .AddRoleStore<ApplicationRoleStore>()
                .AddRoleManager<ApplicationRoleManager>();

            services.AddDataProtection();

            services.AddMvc();

            // I only put this here to keep things simple for people :)
            services.AddWebApiConventions();
        }

        public void Configure(IApplicationBuilder app, IApplicationEnvironment env)
        {
            var certFile = env.ApplicationBasePath + "\\idsrv3test.pfx";
            var userManager = app.ApplicationServices.GetRequiredService<UserManager<ApplicationUser>>();


            app.Map("/core", core =>
            {
                var factory = Factory.Configure();

                factory.Register(new Registration<ApplicationDbContext>());
                factory.Register(new Registration<ApplicationUserStore>());
                factory.Register(new Registration<UserManager<ApplicationUser>>(userManager));

                factory.UserService = new Registration<IUserService, AspNetIdentityUserService>();

                var idsrvOptions = new IdentityServerOptions
                {
                    Factory = factory,
                    RequireSsl = false,
                    SigningCertificate = new X509Certificate2(certFile, "idsrv3test")
                };
                core.UseIdentityServer(idsrvOptions);
            });

            app.Map("/api", api =>
            {
                api.UseOAuthBearerAuthentication(options =>
                    {
                        options.AutomaticAuthentication = true;
                        options.Authority = "http://localhost:35718/core/connect/authorize";
                        options.MetadataAddress = "http://localhost:35718/core/.well-known/openid-configuration";
                        options.TokenValidationParameters.ValidAudience = "http://localhost:35718/core/resources";
                    });

                api.UseMvc();
            });

            app.UseStaticFiles();
            app.UseErrorPage(ErrorPageOptions.ShowAll);

            IdentityDbOperations.InitializeIdentityDbAsync(app.ApplicationServices).Wait();
        }
    }
}