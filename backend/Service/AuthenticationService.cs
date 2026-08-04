using DentalClinic.Models;
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


            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}
