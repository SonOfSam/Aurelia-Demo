namespace AureliaDemo.Providers
{
    using System.Threading.Tasks;
    using AspNet.Security.OpenIdConnect.Server;
    using System.Security.Claims;
    using Microsoft.Framework.DependencyInjection;
    using AspNet.Security.OpenIdConnect.Extensions;

    using AureliaDemo.Models;


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
                identity.AddClaim(ClaimTypes.NameIdentifier, user.UserName);

                // the other claims require explicit destinations
                identity.AddClaim(ClaimTypes.Name, user.FirstName, "token id_token");
                identity.AddClaim(ClaimTypes.Surname, user.LastName, "token id_token");

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
