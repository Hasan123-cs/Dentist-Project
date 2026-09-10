using dentist_project.Data;
using dentist_project.Enums;
using dentist_project.Models;
using Microsoft.EntityFrameworkCore;

namespace dentist_project.Services;

public class NotificationService 
{
    private readonly AppDbContext _context;

    public NotificationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task ProcessAppointmentRemindersAsync()
    {
        var tomorrow = DateOnly.FromDateTime(
            GetLebanonNow().AddDays(1)
        );

        var appointments = await _context.Appointments
            .Include(a => a.Patient)
            .Where(a =>
                a.Status == AppointmentStatus.Scheduled &&
                !a.ReminderSent &&
                a.Patient.Phone != null
            )
            .ToListAsync();

        foreach (var appointment in appointments)
        {
            var appointmentLocalDate =
                TimeZoneInfo.ConvertTimeFromUtc(
                    appointment.StartDateTime,
                    GetLebanonTimeZone()
                ).Date;

            if (DateOnly.FromDateTime(appointmentLocalDate) != tomorrow)
                continue;

            // -----------------------------------------
            // WhatsApp will be sent here later
            // -----------------------------------------

            var notification = new Notification
            {
                PatientId = appointment.PatientId,
                AppointmentId = appointment.Id,
                Type = NotificationType.WhatsApp,
                Message =
                    $"Reminder: You have an appointment tomorrow at " +
                    $"{appointmentLocalDate:dd/MM/yyyy HH:mm}.",
                IsSent = true,
                SentAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);

            appointment.ReminderSent = true;
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
                at.Appointment.Status == AppointmentStatus.Scheduled &&
                at.Treatment.Name == "Cleaning"
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
                    n.AppointmentId == cleaning.AppointmentId &&
                    n.Type == NotificationType.WhatsApp &&
                    n.IsSent
                );

            if (alreadySent)
                continue;

            if (string.IsNullOrWhiteSpace(cleaning.Appointment.Patient.Phone))
                continue;

            // -----------------------------------------
            // WhatsApp will be sent here later
            // -----------------------------------------

            var notification = new Notification
            {
                PatientId = cleaning.Appointment.PatientId,
                AppointmentId = cleaning.AppointmentId,
                Type = NotificationType.WhatsApp,
                Message =
                    $"Hello {cleaning.Appointment.Patient.FirstName}, " +
                    $"it has been 6 months since your last cleaning. " +
                    $"Please schedule your next cleaning appointment.",
                IsSent = true,
                SentAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
        }

        await _context.SaveChangesAsync();
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