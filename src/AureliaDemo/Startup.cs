namespace AureliaDemo
{
    using System;
    using System.IdentityModel.Tokens;
    using System.Security.Cryptography;

    using AspNet.Security.OpenIdConnect.Server;

    using AureliaDemo.Providers;

    using Microsoft.AspNet.Builder;
    using Microsoft.AspNet.Hosting;
    using Microsoft.Dnx.Runtime;
    using Microsoft.Framework.Configuration;
    using Microsoft.Framework.DependencyInjection;
    using System.Reflection;

    using AureliaDemo.Models;

    using Microsoft.AspNet.Http;
    using Microsoft.Data.Entity;
    using Microsoft.AspNet.Identity;
    using Microsoft.Framework.DependencyInjection.Extensions;

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

        public void Configure(IApplicationBuilder app, IRuntimeEnvironment env)
        {
            app.Map("/api", api =>
            {
                api.UseOAuthBearerAuthentication(options =>
                {
                    options.AutomaticAuthentication = true;
                    options.Authority = "http://localhost:35718/";
                    options.Audience = "http://localhost:35718/";
                });

                api.UseMvc();
            });

            app.UseOpenIdConnectServer(options =>
            {
                options.AuthenticationScheme = OpenIdConnectDefaults.AuthenticationScheme;

                // There's currently a bug in System.IdentityModel.Tokens that prevents using X509 certificates on Mono.
                // To work around this bug, a new in-memory RSA key is generated each time this app is started.
                // See https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/issues/179
                if (string.Equals(env.RuntimeType, "Mono", StringComparison.OrdinalIgnoreCase))
                {
                    var rsaCryptoServiceProvider = new RSACryptoServiceProvider(2048);
                    var rsaParameters = rsaCryptoServiceProvider.ExportParameters(true);

                    options.UseKey(new RsaSecurityKey(rsaParameters));
                }
                else
                {
                    options.UseCertificate(typeof(Startup).GetTypeInfo().Assembly, "AureliaDemo.Certificate.pfx", "Owin.Security.OpenIdConnect.Server");
                }

                options.ApplicationCanDisplayErrors = true;
                options.AllowInsecureHttp = true;
                options.Issuer = new Uri("http://localhost:35718/");
                options.AuthorizationEndpointPath = PathString.Empty;

                options.Provider = new AuthorizationProvider();
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();

            ApplicationDbOperations.InitializeIdentityDbAsync(app.ApplicationServices).Wait();
        }
    }
}