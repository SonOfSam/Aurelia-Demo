namespace AureliaDemo.Configuration
{
    using System;    
    using System.Threading.Tasks;
    using System.Collections.Generic;

    using IdentityServer3.Core.Configuration;

    using Microsoft.AspNet.Builder;

    using Owin;
    using Microsoft.Framework.DependencyInjection;
    using Microsoft.AspNet.DataProtection;
    using Microsoft.Owin.Builder;

    using DataProtectionProviderDelegate = System.Func<string[], System.Tuple<System.Func<byte[], byte[]>, System.Func<byte[], byte[]>>>;
    using DataProtectionTuple = System.Tuple<System.Func<byte[], byte[]>, System.Func<byte[], byte[]>>;

    public static class ApplicationBuilderExtensions
    {
        public static void UseIdentityServer(this IApplicationBuilder app, IdentityServerOptions options)
        {
            app.UseOwin(addToPipeline =>
            {
                addToPipeline(next =>
                {
                    var builder = new AppBuilder();

                    var provider = app.ApplicationServices.GetService<IDataProtectionProvider>();

                    builder.Properties["security.DataProtectionProvider"] = new DataProtectionProviderDelegate(purposes =>
                    {
                        var dataProtection = provider.CreateProtector(String.Join(",", purposes));
                        return new DataProtectionTuple(dataProtection.Protect, dataProtection.Unprotect);
                    });

                    builder.UseIdentityServer(options);

                    var appFunc = builder.Build(typeof(Func<IDictionary<string, object>, Task>)) as Func<IDictionary<string, object>, Task>;
                    return appFunc;
                });
            });
        }
    }
}
