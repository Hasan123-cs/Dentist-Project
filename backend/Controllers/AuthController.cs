
using dentist_project.Models;
using dentist_project.DTO;
using dentist_project.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace dentist_project.Controllers;


[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{

    private readonly UserManager<ApplicationUser> _userManager;

    private readonly RoleManager<IdentityRole> _roleManager;

    private AuthenticationService _auth;


    public AuthController(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        AuthenticationService auth
        )
    {
        _userManager = userManager;
        _auth=auth;
        _roleManager = roleManager;
    }



    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        Console.WriteLine("user", dto.Email);
        if (user == null)
        {
            return Unauthorized("Invalid email or password");
        }
        var passwordValid =
            await _userManager.CheckPasswordAsync(
                user,
                dto.Password
            );
        if (!passwordValid)
        {
            return Unauthorized("Invalid email or password");
        }

        if (!user.IsActive)
        {
            return Unauthorized("Account disabled");
        }



        var roles = await _userManager.GetRolesAsync(user);



        var token = await _auth.GenerateJwtToken(
            user,
            roles,
            dto.RememberMe  
        );



        return Ok(new LoginResponseDto
        {
            Token = token,
            Expiration = dto.RememberMe ? DateTime.UtcNow.AddDays(30) : DateTime.UtcNow.AddMinutes(60),
            UserId = user.Id,
            Email = user.Email!,
            FullName =user.FirstName + " " + user.LastName,
            Roles = roles
        });

    }



    
}