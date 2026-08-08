using dentist_project.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace dentist_project.Service
{
    public class AuthenticationService
    {
        private readonly IConfiguration _configuration;
        public AuthenticationService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<string> GenerateJwtToken(ApplicationUser user,IList<string> roles,bool remember)
        {

            var claims = new List<Claim>
        {
            new Claim(
                JwtRegisteredClaimNames.Sub,
                user.Id
            ),

            new Claim(
                JwtRegisteredClaimNames.Email,
                user.Email!
            ),

            new Claim(
                "FirstName",
                user.FirstName
            )
        };


            foreach (var role in roles)
            {
                claims.Add(
                    new Claim(
                        ClaimTypes.Role,
                        role
                    )
                );
            }



            var key =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        _configuration["Jwt:Key"]!
                    )
                );


            var credentials =
                new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256
                );


            var token = new JwtSecurityToken(

                issuer:
                _configuration["Jwt:Issuer"],

                audience:
                _configuration["Jwt:Audience"],

                claims: claims,

                expires:
                remember ? DateTime.UtcNow.AddDays(30) : DateTime.UtcNow.AddMinutes(60),

                signingCredentials:
                credentials
            );


            return  new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
        public  async Task SeedUsersAsync(UserManager<ApplicationUser> userManager,RoleManager<IdentityRole> roleManager)
        {
            // Create Roles
            string[] roles =
            {
            "Doctor",
            "Assistant"
        };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(
                        new IdentityRole(role)
                    );
                }
            }
            var doctorEmail = "Doctor-Amany@clinic.com";

            if (await userManager.FindByEmailAsync(doctorEmail) == null)
            {
                var doctor = new ApplicationUser
                {
                    UserName = doctorEmail,
                    Email = doctorEmail,

                    FirstName = "Amany",
                    LastName = "Nseif",

                    IsActive = true,
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow
                };


                var result = await userManager.CreateAsync(
                    doctor,
                    "Amany@123"
                );

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(
                        doctor,
                        "Doctor"
                    );
                }
            }



            // Create Assistant Account
            var assistantEmail = "assistant@clinic.com";
            if (await userManager.FindByEmailAsync(assistantEmail) == null)
            {

                var assistant = new ApplicationUser
                {
                    UserName = assistantEmail,
                    Email = assistantEmail,

                    FirstName = "User",
                    LastName = "Assistant",

                    IsActive = true,
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow
                };


                var result = await userManager.CreateAsync(
                    assistant,
                    "Assistant@123"
                );


                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(
                        assistant,
                        "Assistant"
                    );
                }
            }

        }
    }
}
