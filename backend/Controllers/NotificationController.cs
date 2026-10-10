using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dentist_project.Data;
using dentist_project.DTO;
using dentist_project.Enums;

namespace dentist_project.Controllers;


[Authorize]
[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{

    private readonly AppDbContext _context;


    public NotificationsController(AppDbContext context)
    {
        _context = context;
    }



    // GET: api/notifications/reminders
    [HttpGet("reminders")]
    public async Task<IActionResult> GetReminders()
    {

        var todayUtc = DateTime.UtcNow.Date;

        var tomorrowStart = todayUtc.AddDays(1);

        var tomorrowEnd = todayUtc.AddDays(2);



        var reminders = await _context.Notifications

            .Include(x => x.Patient)

            .Include(x => x.Appointment)

            .Where(x =>
                !x.IsSent
                &&
                (
                    // Appointment reminders
                    (
                        x.Type == NotificationType.AppointmentReminder
                        &&
                        x.Appointment != null
                        &&
                        x.Appointment.Status != AppointmentStatus.Cancelled
                        &&
                        x.Appointment.Status != AppointmentStatus.Completed
                        &&
                        x.Appointment.StartDateTime >= tomorrowStart
                        &&
                        x.Appointment.StartDateTime < tomorrowEnd
                    )


                    ||

                    // Cleaning reminders
                    (
                           x.Type == NotificationType.CleaningReminder
    &&
    x.ReminderDate.HasValue
    &&
    x.ReminderDate.Value.Date == todayUtc.AddDays(1)
                    )
                )
            )

            .ToListAsync();



        var result = reminders.Select(x => new ReminderDto
        {

            Id = x.Id,


            PatientName =
                x.Patient.FirstName + " " +
                x.Patient.LastName,


            Phone =
                x.Patient.Phone,


            Message =
                x.Message,


            Type =
                x.Type.ToString(),


            Date =
    x.Type == NotificationType.CleaningReminder
    ?
    x.Message
    :
    x.Appointment.StartDateTime
        .ToLocalTime()
        .ToString("yyyy-MM-dd"),


            Time =
    x.Type == NotificationType.CleaningReminder
    ?
    ""
    :
    x.Appointment.StartDateTime
        .ToLocalTime()
        .ToString("HH:mm")

        })
        .ToList();



        return Ok(result);

    }
}