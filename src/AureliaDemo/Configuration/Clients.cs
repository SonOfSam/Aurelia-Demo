namespace AureliaDemo.Configuration
{
    using System;
    using System.Collections.Generic;
    using System.Text;
    using Thinktecture.IdentityServer.Core.Models;

    public class Clients
    {
        public static string HeaderFormatExample()
        {
            var encoding = Encoding.UTF8;
            var credentials = $"{"IdentityWebUI"}:{"secret"}";

            var headerValue = Convert.ToBase64String(encoding.GetBytes(credentials));

            return $"{"Basic"} {headerValue}";
        }

        public static List<Client> Get()
        {
            return new List<Client>
                       {
                           new Client
                               {
                                   ClientName = "WebUI",
                                   Enabled = true,
                                   ClientId = "IdentityWebUI",
                                   ClientSecrets = new List<ClientSecret> { new ClientSecret("secret".Sha256()) },
                                   Flow = Flows.ResourceOwner,
                                   AccessTokenType = AccessTokenType.Jwt,
                                   AccessTokenLifetime = 3600
                               }
                       };
        }
    }

}
