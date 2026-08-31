using dentist_project.DTO;
using dentist_project.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        [HttpPut("{id}/time")]
        public async Task<IActionResult> UpdateAppointmentTime(
        int id,
        UpdateAppointmentTimeDto dto)
        {
            var result =
                await _appointmentService.UpdateAppointmentTimeAsync(id, dto);

            if (!result.success)
            {
                return BadRequest(new
                {
                    message = result.message
                });
            }

            return Ok(new
            {
                message = "Appointment updated successfully."
            });
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var result = await _appointmentService.CancelAppointmentAsync(id);

            if (!result.success)
            {
                return BadRequest(new
                {
                    message = result.message
                });
            }

            return Ok(new
            {
                message = "Appointment cancelled successfully."
            });
        }
    }
}
    