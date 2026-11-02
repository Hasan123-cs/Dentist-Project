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
        var lebanonTimeZone = GetLebanonTimeZone();
        var todayInLebanon = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.UtcNow,
            lebanonTimeZone).Date;

        var tomorrowStartInLebanon = DateTime.SpecifyKind(
            todayInLebanon.AddDays(1),
            DateTimeKind.Unspecified);
        var tomorrowEndInLebanon = DateTime.SpecifyKind(
            todayInLebanon.AddDays(2),
            DateTimeKind.Unspecified);

        var tomorrowStartUtc = TimeZoneInfo.ConvertTimeToUtc(
            tomorrowStartInLebanon,
            lebanonTimeZone);
        var tomorrowEndUtc = TimeZoneInfo.ConvertTimeToUtc(
            tomorrowEndInLebanon,
            lebanonTimeZone);



        var reminders = await _context.Notifications

            .Include(x => x.Patient)

            .Include(x => x.Appointment)

            .Where(x =>
                x.IsSent
                || (
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
                        x.Appointment.StartDateTime >= tomorrowStartUtc
                        &&
                        x.Appointment.StartDateTime < tomorrowEndUtc
                    )


                    ||

                    // Cleaning reminders
                    (
                        x.Type == NotificationType.CleaningReminder
                        &&
                        x.ReminderDate.HasValue
                        &&
                        x.ReminderDate.Value <= tomorrowStartUtc
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

            IsSent = x.IsSent,

            Date =
                x.Type == NotificationType.CleaningReminder
                    ? x.Message
                    : x.Appointment == null
                        ? ""
                        : ConvertToLebanonTime(
                            x.Appointment.StartDateTime,
                            lebanonTimeZone).ToString("yyyy-MM-dd"),


            Time =
                x.Type == NotificationType.CleaningReminder
                    ? ""
                    : x.Appointment == null
                        ? ""
                        : ConvertToLebanonTime(
                            x.Appointment.StartDateTime,
                            lebanonTimeZone).ToString("HH:mm")

        })
        .ToList();



        return Ok(result);

    }

    private static TimeZoneInfo GetLebanonTimeZone()
    {
        var timeZoneId = OperatingSystem.IsWindows()
            ? "Middle East Standard Time"
            : "Asia/Beirut";

        return TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
    }

    private static DateTime ConvertToLebanonTime(
        DateTime utcDateTime,
        TimeZoneInfo timeZone)
    {
        return TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc),
            timeZone);
    }

    [HttpPut("reminders/{id:int}/sent")]
    public async Task<IActionResult> MarkReminderAsSent(int id)
    {
        var reminder = await _context.Notifications
            .FirstOrDefaultAsync(notification => notification.Id == id);

        if (reminder == null)
        {
            return NotFound(new { message = "Reminder not found." });
        }

        if (!reminder.IsSent)
        {
            reminder.IsSent = true;
            reminder.SentAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "Reminder marked as submitted." });
    }
}