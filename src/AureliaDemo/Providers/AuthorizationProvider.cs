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

        public override async Task ValidateClientAuthentication(ValidateClientAuthenticationNotification notification)
        {
            // Note: client authentication is not mandatory for non-confidential client applications like mobile apps
            // (except when using the client credentials grant type) but this authorization server uses a safer policy
            // that makes client authentication mandatory and returns an error if client_id or client_secret is missing.
            // You may consider relaxing it to support the resource owner password credentials grant type
            // with JavaScript or desktop applications, where client credentials cannot be safely stored.
            if (string.IsNullOrEmpty(notification.ClientId) || string.IsNullOrEmpty(notification.ClientSecret))
            {
                notification.Rejected(
                    error: "invalid_request",
                    description: "Missing credentials: ensure that your credentials were correctly " +
                                 "flowed in the request body or in the authorization header");

                return;
            }

            var context = notification.HttpContext.RequestServices.GetRequiredService<ApplicationContext>();

            // Retrieve the application details corresponding to the requested client_id.
            var application = await (from entity in context.Applications
                                     where entity.ApplicationId == notification.ClientId
                                     select entity).SingleOrDefaultAsync(notification.HttpContext.RequestAborted);

            if (application == null)
            {
                notification.Rejected(
                    error: "invalid_client",
                    description: "Application not found in the database: ensure that your client_id is correct");

                return;
            }

            if (!string.Equals(notification.ClientSecret, application.Secret, StringComparison.Ordinal))
            {
                notification.Rejected(
                    error: "invalid_client",
                    description: "Invalid credentials: ensure that you specified a correct client_secret");

                return;
            }

            notification.Validated();
        }

        public override Task ValidateTokenRequest(ValidateTokenRequestNotification notification)
        {
            // Note: OpenIdConnectServerHandler supports authorization code, refresh token, client credentials
            // and resource owner password credentials grant types but this authorization server uses a safer policy
            // rejecting the last two ones. You may consider relaxing it to support the ROPC or client credentials grant types.
            if (notification.Request.IsAuthorizationCodeGrantType() || notification.Request.IsRefreshTokenGrantType())
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
