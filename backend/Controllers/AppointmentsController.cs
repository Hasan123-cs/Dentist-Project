using dentist_project.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace dentist_project.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentsController : Controller
    {
        private readonly AppointmentsService _appointmentService;

        public AppointmentsController(
            AppointmentsService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointments([FromQuery] DateTime start,[FromQuery] DateTime end)
        {
            var appointments =await _appointmentService.GetAppointmentsAsync(start,end);
            return Ok(appointments);
        }
    }
}
    