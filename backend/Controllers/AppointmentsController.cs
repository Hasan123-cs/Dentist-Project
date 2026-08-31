using dentist_project.DTO;
using dentist_project.Models;
using dentist_project.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<ApplicationUser> _userManager;
        public AppointmentsController(
            AppointmentsService appointmentService,UserManager<ApplicationUser> s)
        {
            _userManager = s;
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

[HttpPost]
public async Task<IActionResult> CreateAppointment(
    [FromBody] CreateAppointmentDto dto)
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new
                    {
                        message = "User not authenticated."
                    });
                }
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null) 
                { return Unauthorized(new { message = "User not found." }); }

                // Call the service
                var result = await _appointmentService.CreateAppointmentAsync(
                    dto,
                    userId
                );

                // If creation failed
                if (!result.sucsess)
                {
                    return BadRequest(new
                    {
                        message = result.message
                    });
                }

                // If creation succeeded
                return Ok(new
                {
                    message = result.message + "name of creater is  : " + user.UserName!
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while creating the appointment.",
                    error = ex.Message
                });
            }
        }


    }
}
    