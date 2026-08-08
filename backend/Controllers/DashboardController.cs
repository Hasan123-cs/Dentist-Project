using dentist_project.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
namespace dentist_project.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;
    public DashboardController(DashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }
    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        // make attention (reader ) this is not identity entity  its the jwt claim getting from the jwt middleware
        var role =User.FindFirst(ClaimTypes.Role)?.Value;

        if (role == null)
        {
            return RedirectToPage("Account/Login");
        }
        var dashboard =await _dashboardService.GetDashboardAsync(role);
        return Ok(dashboard);
    }

}