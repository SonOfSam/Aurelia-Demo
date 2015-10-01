namespace AureliaDemo
{
    using System;

    using AspNet.Security.OpenIdConnect.Server;

    using AureliaDemo.Providers;

    using Microsoft.AspNet.Builder;
    using Microsoft.AspNet.Hosting;
    using Microsoft.Dnx.Runtime;
    using Microsoft.Framework.Configuration;
    using Microsoft.Framework.DependencyInjection;

    using AureliaDemo.Models;

    using Microsoft.AspNet.Http;
    using Microsoft.Data.Entity;
    using Microsoft.AspNet.Identity;
    using Microsoft.Framework.DependencyInjection.Extensions;
    using Microsoft.Framework.Logging;
    using Microsoft.IdentityModel.Protocols;
    using Microsoft.IdentityModel.Protocols.OpenIdConnect;

    public class Startup
    {
        public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(appEnv.ApplicationBasePath)
                .AddJsonFile("config.json")
                .AddJsonFile($"config.{env.EnvironmentName}.json", optional: true);

            this.Configuration = builder.Build();
        }

        #region Properties

        public IConfiguration Configuration { get; set; }

        #endregion //Properties

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddEntityFramework()
                .AddSqlServer()
                .AddDbContext<ApplicationContext>(options =>
                    options.UseSqlServer(this.Configuration["Data:DefaultConnection:ConnectionString"]));

            services.Configure<ContextOptions>(options =>
           {
               options.DefaultAdminUserName = this.Configuration["AdminUser:Username"];
               options.DefaultAdminPassword = this.Configuration["AdminUser:Password"];
           });

            services.TryAdd(ServiceDescriptor.Scoped<IUserStore<ApplicationUser>, ApplicationUserStore>());
            services.TryAdd(ServiceDescriptor.Scoped<IRoleStore<ApplicationRole>, ApplicationRoleStore>());
            services.TryAdd(ServiceDescriptor.Scoped<RoleManager<ApplicationRole>, ApplicationRoleManager>());

            services.AddIdentity<ApplicationUser, ApplicationRole>()
                .AddUserStore<ApplicationUserStore>()
                .AddRoleStore<ApplicationRoleStore>()
                .AddRoleManager<ApplicationRoleManager>();

            //OpenIdConnect Server
            services.AddAuthentication();
            services.AddCaching();

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IRuntimeEnvironment env, ILoggerFactory factory)
        {
            factory.AddConsole();

            app.Map("/api", api =>
            {
                api.UseJwtBearerAuthentication(options =>
                {
                    options.AutomaticAuthentication = true;
                    options.Authority = "http://localhost:35718/";
                    options.Audience = "http://localhost:35718/";

                    // Note: by default, IdentityModel beta8 now refuses to initiate non-HTTPS calls.
                    // To work around this limitation, the configuration manager is manually
                    // instantiated with a document retriever allowing HTTP calls.
                    options.ConfigurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                        metadataAddress: options.Authority + ".well-known/openid-configuration",
                        configRetriever: new OpenIdConnectConfigurationRetriever(),
                        docRetriever: new HttpDocumentRetriever { RequireHttps = options.Authority.StartsWith("https", StringComparison.OrdinalIgnoreCase) });
                });

                api.UseMvc();
            });

            app.UseOpenIdConnectServer(configuration =>
            {
                configuration.Options.AllowInsecureHttp = true;
                configuration.Options.AuthorizationEndpointPath = PathString.Empty;

                configuration.Provider = new AuthorizationProvider();
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();

            ApplicationDbOperations.InitializeIdentityDbAsync(app.ApplicationServices).Wait();
        }
    }
}