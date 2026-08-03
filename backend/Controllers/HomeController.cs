using Microsoft.AspNetCore.Mvc;

namespace dentist_project.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { Message = "Hello from API" });
            
        }
    }
}
