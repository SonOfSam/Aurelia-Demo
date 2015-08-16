namespace AureliaDemo.Configuration
{
    using System.Collections.Generic;

    using IdentityServer3.Core.Models;

    public class Clients
    {
        public static List<Client> Get()
        {
            return new List<Client>
                       {
                           new Client
                               {
                                   ClientName = "WebUI",
                                   Enabled = true,
                                   ClientId = "IdentityWebUI",
                                   ClientSecrets = new List<Secret> { new Secret("secret".Sha256()) },
                                   Flow = Flows.ResourceOwner,
                                   AccessTokenType = AccessTokenType.Jwt,
                                   AccessTokenLifetime = 3600,
                                   AllowedScopes = new List<string>
                                                       {
                                                           "openid"
                                                       }
                               }
                       };
        }
    }

}
