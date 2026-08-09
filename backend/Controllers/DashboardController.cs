using dentist_project.Models;
using dentist_project.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Xml.Linq;
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
            return Unauthorized();
        }
        var dashboard =await _dashboardService.GetDashboardAsync(role);
       var x  = User.FindFirst("FirstName")?.Value;
        if(x is null)
        {
            dashboard.userName = "Doctor";
        }
        else
        {

        dashboard.userName = x;
        }
        return Ok(dashboard);
    }

}