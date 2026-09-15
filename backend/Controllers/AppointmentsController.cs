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
                var userId = User.FindFirst(
                    System.Security.Claims.ClaimTypes.NameIdentifier
                )?.Value;

                Console.WriteLine(
                    "===================================================="
                );
                Console.WriteLine(
                    "User ID: " + userId
                );

                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Unauthorized(new
                    {
                        message = "User not authenticated."
                    });
                }


                var user = await _userManager.FindByIdAsync(userId);

                Console.WriteLine(
                    "User: " + user
                );


                if (user == null)
                {
                    return Unauthorized(new
                    {
                        message = "User not found."
                    });
                }

                var result =
                    await _appointmentService.CreateAppointmentAsync(
                        dto,
                        userId
                    );

                if (!result.sucsess)
                {
                    return BadRequest(new
                    {
                        message = result.message
                    });
                }

                return Ok(new
                {
                    message = result.message,
                    createdBy = user.UserName
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "========== CREATE APPOINTMENT ERROR =========="
                );

                Console.WriteLine(ex.ToString());

                Console.WriteLine(
                    "=============================================="
                );


                return StatusCode(500, new
                {
                    message =
                        "An error occurred while creating the appointment.",

                    error = ex.Message
                });
            }
        }
       [HttpPut("{id}/complete")]
    public async Task<IActionResult> CompleteAppointment(
    int id,
    [FromBody] CompleteAppointmentDto dto)
        {
            try
            {
                var result =
                    await _appointmentService.CompleteAppointmentAsync(
                        id,
                        dto);

                if (!result.Success)
                {
                    return BadRequest(new
                    {
                        message = result.Message
                    });
                }

                return Ok(new
                {
                    message = result.Message,
                    data = result.Data
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while completing the appointment.",
                    error = ex.Message
                });
            }
        }
[HttpGet("{id}")]
public async Task<IActionResult> GetAppointment(int id)
        {
            try
            {
                var result =
                    await _appointmentService.GetAppointmentByIdAsync(id);

                if (!result.Success)
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                return Ok(result.Data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while loading the appointment.",
                    error = ex.Message
                });
            }
        }


        }


}
    