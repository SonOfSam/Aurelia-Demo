using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AureliaDemo.IdentityServerItems
{
    using System.Security.Claims;

    using AureliaDemo.Models;

    using IdentityServer3.Core;
    using IdentityServer3.Core.Models;
    using IdentityServer3.Core.Services.Default;

    using Microsoft.AspNet.Identity;

    public class AspNetIdentityUserService : UserServiceBase
    {
        private readonly UserManager<ApplicationUser> userManager;

        public AspNetIdentityUserService(UserManager<ApplicationUser> userManager)
        {
            this.userManager = userManager;
        }

        public bool EnableSecurityStamp { get; set; }
        public string DisplayNameClaimType { get; set; }

        public override async Task AuthenticateLocalAsync(LocalAuthenticationContext ctx)
        {
            var username = ctx.UserName;
            var password = ctx.Password;
            var message = ctx.SignInMessage;

            ctx.AuthenticateResult = null;

            if (this.userManager.SupportsUserPassword)
            {
                var user = await this.FindUserAsync(username);
                if (user != null)
                {
                    if (this.userManager.SupportsUserLockout &&
                        await this.userManager.IsLockedOutAsync(user))
                    {
                        return;
                    }

                    if (await this.userManager.CheckPasswordAsync(user, password))
                    {
                        if (this.userManager.SupportsUserLockout)
                        {
                            await this.userManager.ResetAccessFailedCountAsync(user);
                        }

                        var result = await this.PostAuthenticateLocalAsync(user, message);
                        if (result == null)
                        {
                            var claims = await this.GetClaimsForAuthenticateResult(user);
                            result = new AuthenticateResult(user.Id.ToString(), await this.GetDisplayNameForAccountAsync(user.Id), claims);
                        }

                        ctx.AuthenticateResult = result;
                    }
                    else if (this.userManager.SupportsUserLockout)
                    {
                        await this.userManager.AccessFailedAsync(user);
                    }
                }
            }
        }

        protected async virtual Task<ApplicationUser> FindUserAsync(string username)
        {
            return await this.userManager.FindByNameAsync(username);
        }

        protected virtual Task<AuthenticateResult> PostAuthenticateLocalAsync(ApplicationUser user, SignInMessage message)
        {
            return Task.FromResult<AuthenticateResult>(null);
        }

        protected virtual async Task<IEnumerable<Claim>> GetClaimsForAuthenticateResult(ApplicationUser user)
        {
            List<Claim> claims = new List<Claim>();
            if (this.EnableSecurityStamp && this.userManager.SupportsUserSecurityStamp)
            {
                var stamp = await this.userManager.GetSecurityStampAsync(user);
                if (!String.IsNullOrWhiteSpace(stamp))
                {
                    claims.Add(new Claim("security_stamp", stamp));
                }
            }
            return claims;
        }

        protected virtual async Task<string> GetDisplayNameForAccountAsync(int userId)
        {
            var user = await this.userManager.FindByIdAsync(userId.ToString());
            var claims = await this.GetClaimsFromAccount(user);

            var claimsArray = claims.ToArray();

            Claim nameClaim = null;
            if (this.DisplayNameClaimType != null)
            {
                nameClaim = claimsArray.FirstOrDefault(x => x.Type == this.DisplayNameClaimType);
            }
            if (nameClaim == null) nameClaim = claimsArray.FirstOrDefault(x => x.Type == Constants.ClaimTypes.Name);
            if (nameClaim == null) nameClaim = claimsArray.FirstOrDefault(x => x.Type == ClaimTypes.Name);
            if (nameClaim != null) return nameClaim.Value;

            return user.UserName;
        }

        protected virtual async Task<IEnumerable<Claim>> GetClaimsFromAccount(ApplicationUser user)
        {
            var claims = new List<Claim>{
                new Claim(Constants.ClaimTypes.Subject, user.Id.ToString()),
                new Claim(Constants.ClaimTypes.PreferredUserName, user.UserName),
            };

            if (this.userManager.SupportsUserEmail)
            {
                var email = await this.userManager.GetEmailAsync(user);
                if (!String.IsNullOrWhiteSpace(email))
                {
                    claims.Add(new Claim(Constants.ClaimTypes.Email, email));
                    var verified = await this.userManager.IsEmailConfirmedAsync(user);
                    claims.Add(new Claim(Constants.ClaimTypes.EmailVerified, verified ? "true" : "false"));
                }
            }

            if (this.userManager.SupportsUserPhoneNumber)
            {
                var phone = await this.userManager.GetPhoneNumberAsync(user);
                if (!String.IsNullOrWhiteSpace(phone))
                {
                    claims.Add(new Claim(Constants.ClaimTypes.PhoneNumber, phone));
                    var verified = await this.userManager.IsPhoneNumberConfirmedAsync(user);
                    claims.Add(new Claim(Constants.ClaimTypes.PhoneNumberVerified, verified ? "true" : "false"));
                }
            }

            if (this.userManager.SupportsUserClaim)
            {
                claims.AddRange(await this.userManager.GetClaimsAsync(user));
            }

            if (this.userManager.SupportsUserRole)
            {
                var roleClaims =
                    from role in await this.userManager.GetRolesAsync(user)
                    select new Claim(Constants.ClaimTypes.Role, role);
                claims.AddRange(roleClaims);
            }

            return claims;
        }

    }
}
