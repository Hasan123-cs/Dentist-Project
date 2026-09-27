using dentist_project.Data;
using dentist_project.Enums;
using dentist_project.Models;
using Microsoft.EntityFrameworkCore;

namespace dentist_project.Services;

public class NotificationService 
{
    private readonly AppDbContext _context;
    private readonly WhatsAppService _whatsappService;

    public NotificationService(
    AppDbContext context,
    WhatsAppService whatsappService)
    {
        _context = context;
        _whatsappService = whatsappService;
    }

    public async Task ProcessAppointmentRemindersAsync()
    {
        var tomorrow = DateOnly.FromDateTime(
            GetLebanonNow().AddDays(1)
        );

        var now = GetLebanonNow();

        var appointments = await _context.Appointments
            .Include(a => a.Patient)
            .Where(a =>
                !a.ReminderSent &&
                a.Status != AppointmentStatus.Completed &&
                a.Status != AppointmentStatus.Cancelled &&
                a.Patient.Phone != null &&
                a.StartDateTime > DateTime.UtcNow
            )
            .ToListAsync();

        foreach (var appointment in appointments)
        {
            if (appointment.Status == AppointmentStatus.Completed ||
    appointment.Status == AppointmentStatus.Cancelled ||
    appointment.StartDateTime <= DateTime.UtcNow)
            {
                continue;
            }
            var appointmentLocalDate =
                TimeZoneInfo.ConvertTimeFromUtc(
                    appointment.StartDateTime,
                    GetLebanonTimeZone()
                ).Date;

            if (DateOnly.FromDateTime(appointmentLocalDate) != tomorrow)
                continue;


            var notification = new Notification
            {
                PatientId = appointment.PatientId,
                AppointmentId = appointment.Id,
                Type = NotificationType.WhatsApp,
                Message =
         $"Reminder: You have an appointment tomorrow at " +
         $"{appointmentLocalDate:dd/MM/yyyy HH:mm}.",
                IsSent = false
            };


            // 1- create notification first
            _context.Notifications.Add(notification);

            await _context.SaveChangesAsync();


            // 2- send WhatsApp
            var sent = await _whatsappService.SendMessage(
                appointment.Patient.Phone,
                notification.Message
            );


            // 3- update status
            notification.IsSent = sent;

            if (sent)
            {
                notification.SentAt = DateTime.UtcNow;
            }


            appointment.ReminderSent = sent;
        }

        await _context.SaveChangesAsync();
    }

    public async Task ProcessCleaningRecallsAsync()
    {
        var today = DateOnly.FromDateTime(GetLebanonNow());

        var cleaningAppointments = await _context.AppointmentTreatments
            .Include(at => at.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(at => at.Treatment)
            .Where(at =>
    at.Appointment.Status == AppointmentStatus.Completed
    &&
    at.Treatment.HasRecallReminder
)
            .ToListAsync();

        var latestCleaningPerPatient = cleaningAppointments
            .GroupBy(at => at.Appointment.PatientId)
            .Select(g => g
                .OrderByDescending(x => x.Appointment.StartDateTime)
                .First())
            .ToList();

        foreach (var cleaning in latestCleaningPerPatient)
        {
            var cleaningDate = DateOnly.FromDateTime(
                TimeZoneInfo.ConvertTimeFromUtc(
                    cleaning.Appointment.StartDateTime,
                    GetLebanonTimeZone()
                )
            );

            var recallDate = cleaningDate.AddMonths(6);

            if (recallDate > today)
                continue;

            var alreadySent = await _context.Notifications
    .AnyAsync(n =>
        n.PatientId == cleaning.Appointment.PatientId
        &&
        n.Message.Contains("follow-up")
        &&
        n.SentAt >= DateTime.UtcNow.AddMonths(-6)
    );

            if (alreadySent)
                continue;

            if (string.IsNullOrWhiteSpace(cleaning.Appointment.Patient.Phone))
                continue;


            var notification = new Notification
            {
                PatientId = cleaning.Appointment.PatientId,
                AppointmentId = cleaning.AppointmentId,
                Type = NotificationType.WhatsApp,

                Message =
          $"Hello {cleaning.Appointment.Patient.FirstName}, " +
          $"your {cleaning.Treatment.Name} follow-up is due. " +
          $"Please schedule your next appointment.",

                IsSent = false
            };


            // 1- Save notification first
            _context.Notifications.Add(notification);

            await _context.SaveChangesAsync();


            // 2- Send WhatsApp
            var sent = await _whatsappService.SendMessage(
                cleaning.Appointment.Patient.Phone,
                notification.Message
            );


            // 3- Update result
            notification.IsSent = sent;

            if (sent)
            {
                notification.SentAt = DateTime.UtcNow;
            }


            await _context.SaveChangesAsync();

        }

    }

    public async Task RemoveAppointmentNotificationAsync(int appointmentId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.AppointmentId == appointmentId)
            .ToListAsync();

        if (notifications.Count == 0)
            return;

        _context.Notifications.RemoveRange(notifications);

        await _context.SaveChangesAsync();
    }

    private static DateTime GetLebanonNow()
    {
        return TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.UtcNow,
            GetLebanonTimeZone()
        );
    }

    private static TimeZoneInfo GetLebanonTimeZone()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById(
                "Middle East Standard Time"
            );
        }
        catch
        {
            return TimeZoneInfo.FindSystemTimeZoneById(
                "Asia/Beirut"
            );
        }
    }
}