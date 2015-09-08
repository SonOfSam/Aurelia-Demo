using System;
using System.Threading.Tasks;

namespace AureliaDemo.Providers
{
    using AspNet.Security.OpenIdConnect.Server;
    using System.Linq;
    using System.Security.Claims;

    using AureliaDemo.Models;
    using Microsoft.Framework.DependencyInjection;
    using Microsoft.Data.Entity;
    using AspNet.Security.OpenIdConnect.Extensions;

    using Microsoft.AspNet.Authentication;
    using Microsoft.AspNet.Identity;

    public sealed class AuthorizationProvider : OpenIdConnectServerProvider
    {
        public async override Task GrantResourceOwnerCredentials(GrantResourceOwnerCredentialsNotification notification)
        {
            var username = notification.UserName;
            var password = notification.Password;

            var userManager = notification
                .HttpContext
                .RequestServices
                .GetRequiredService<UserManager<ApplicationUser>>();

            var user = await userManager.FindByNameAsync(username);
            var isValid = await userManager.CheckPasswordAsync(user, password);

            if (isValid)
            {
                var identity = new ClaimsIdentity(OpenIdConnectDefaults.AuthenticationScheme);

                // this automatically goes into the token and id_token
                identity.AddClaim(ClaimTypes.NameIdentifier, "TODO: Add an appropriate name identifier.");

                // the other claims require explicit destinations
                identity.AddClaim(ClaimTypes.Name, username, "token id_token");
                identity.AddClaim(ClaimTypes.Surname, "Doe", "token id_token");

                var principal = new ClaimsPrincipal(identity);
                notification.Validated(principal);
            }
        }

        public override Task ValidateClientAuthentication(ValidateClientAuthenticationNotification notification)
        {
            notification.ClientId = string.Empty;
            notification.Validated();
            return Task.FromResult<object>(null);
        }

        public override Task ValidateTokenRequest(ValidateTokenRequestNotification notification)
        {
            if (notification.Request.IsPasswordGrantType() || notification.Request.IsRefreshTokenGrantType())
            {
                notification.Validated();

                return Task.FromResult<object>(null);
            }

            notification.Rejected(
                error: "unsupported_grant_type",
                description: "Only authorization code and refresh token grant types " +
                             "are accepted by this authorization server");

            return Task.FromResult<object>(null);
        }
    }
}
