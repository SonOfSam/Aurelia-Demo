namespace AureliaDemo
{
    using System.Security.Cryptography.X509Certificates;

    using AureliaDemo.Configuration;

    using Microsoft.AspNet.Builder;
    using Microsoft.AspNet.Diagnostics;
    using Microsoft.Framework.DependencyInjection;
    using Microsoft.Framework.Runtime;

    using Thinktecture.IdentityServer.Core.Configuration;
    using Thinktecture.IdentityServer.Core.Logging;

    public class Startup
    {
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDataProtection();

            services.AddMvc();

            // I only put this here to keep things simple for people :)
            services.AddWebApiConventions();
        }

        public void Configure(IApplicationBuilder app, IApplicationEnvironment env)
        {
            var certFile = env.ApplicationBasePath + "\\idsrv3test.pfx";

            var test = Clients.HeaderFormatExample();

            app.Map("/core", core =>
            {
                var factory = InMemoryFactory.Create(Users.Get(), Clients.Get(), Scopes.Get());
                var loggingOptions = new LoggingOptions();
                loggingOptions.EnableHttpLogging = true;
                loggingOptions.IncludeSensitiveDataInLogs = true;
                LogProvider.SetCurrentLogProvider(new DiagnosticsTraceLogProvider());

                var idsrvOptions = new IdentityServerOptions
                {
                    LoggingOptions = loggingOptions,
                    Factory = factory,
                    RequireSsl = false,
                    SigningCertificate = new X509Certificate2(certFile, "idsrv3test"),
                    CorsPolicy = CorsPolicy.AllowAll
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
        }
    }
}
