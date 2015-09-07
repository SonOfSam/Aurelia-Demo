namespace AureliaDemo
{
    using Microsoft.AspNet.Builder;
    using Microsoft.AspNet.Hosting;
    using Microsoft.Dnx.Runtime;
    using Microsoft.Framework.Configuration;
    using Microsoft.Framework.DependencyInjection;

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
            services.AddDataProtection();

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IApplicationEnvironment env)
        {
            app.UseStaticFiles();
        }
    }
}