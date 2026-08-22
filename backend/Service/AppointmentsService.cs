
using dentist_project.Data;
using dentist_project.DTO;
using dentist_project.Enums;
using Microsoft.EntityFrameworkCore;
namespace dentist_project.Service
{
    public class AppointmentsService
    {
        private readonly AppDbContext _db;

        public AppointmentsService(AppDbContext context)
        {
            _db = context;
        }

        public async Task<AppointmentResponseDto> GetAppointmentsAsync(
            DateTime start,
            DateTime end)
        {
            var startUtc = DateTime.SpecifyKind(start, DateTimeKind.Utc);
            var endUtc = DateTime.SpecifyKind(end, DateTimeKind.Utc);

            var nowUtc = DateTime.UtcNow;
            var todayUtcStart = DateTime.UtcNow.Date;
            var todayUtcEnd = todayUtcStart.AddDays(1);

            var todayAppointments = await _db.Appointments
                .AsNoTracking()
                .Where(a => a.StartDateTime >= todayUtcStart && a.StartDateTime < todayUtcEnd)
                .Select(a => new { a.Status, a.StartDateTime, a.EndDateTime })
                .ToListAsync();

            int realTotalToday = todayAppointments.Count;
            int realCompleted = todayAppointments.Count(a => a.Status.ToString().Equals("Completed", StringComparison.OrdinalIgnoreCase));
            int realScheduled = todayAppointments.Count(a => a.Status.ToString().Equals("Scheduled", StringComparison.OrdinalIgnoreCase));
            int realInProgress = todayAppointments.Count(a =>
                a.StartDateTime <= nowUtc &&
                a.EndDateTime >= nowUtc &&
                !a.Status.ToString().Equals("Cancelled", StringComparison.OrdinalIgnoreCase));

            var rawData = await _db.Appointments
                .AsNoTracking()
                .Where(a =>
                    a.StartDateTime < endUtc &&
                    a.EndDateTime > startUtc)
                .OrderBy(a => a.StartDateTime)
                .Select(a => new
                {
                    a.Id,
                    a.PatientId,
                    PatientFirstName = a.Patient.FirstName,
                    PatientLastName = a.Patient.LastName,
                    Phone = a.Patient.Phone,
                    a.StartDateTime,
                    a.EndDateTime,
                    a.Status,
                    a.TotalCost,
                    a.Notes
                })
                .ToListAsync();

            var appointmentsList = rawData.Select(a =>
            {
                var localStart = a.StartDateTime.ToLocalTime();
                var localEnd = a.EndDateTime.ToLocalTime();

                return new AppointmentDto
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    PatientName = $"{a.PatientFirstName} {a.PatientLastName}".Trim(),
                    Phone = a.Phone,
                    StartDateTime = a.StartDateTime,
                    EndDateTime = a.EndDateTime,
                    AppointmentDate = localStart.ToString("yyyy-MM-dd"),
                    StartTime = localStart.ToString("HH:mm:ss"),
                    EndTime = localEnd.ToString("HH:mm:ss"),
                    Status = a.Status.ToString(),
                    TotalCost = a.TotalCost,
                    Notes = a.Notes
                };
            }).ToList();

            return new AppointmentResponseDto
            {
                TotalToday = realTotalToday,
                Completed = realCompleted,
                InProgress = realInProgress,
                Scheduled = realScheduled,
                Appointments = appointmentsList
            };

        }
        public async Task<(bool success ,string message)> UpdateAppointmentTimeAsync(
        int appointmentId,
        UpdateAppointmentTimeDto dto)
        {
            if (dto.EndDateTime <= dto.StartDateTime)
            {
                return (false,
                    "End time must be after start time."
                    );
            }

            var appointment = await _db.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
            {
                return (false,
                    "Appointment not found."
                    );
            }

            if (appointment.Status == AppointmentStatus.Cancelled)
            {
                return (false,
                    "Cancelled appointments cannot be moved.");
            }

            var hasConflict = await _db.Appointments
                .AnyAsync(a =>
                    a.Id != appointmentId &&
                    a.Status != AppointmentStatus.Cancelled &&
                    dto.StartDateTime < a.EndDateTime &&
                    dto.EndDateTime > a.StartDateTime
                );

            if (hasConflict)
            {
                return (false,
                    "This time overlaps with another appointment.");
            }

            appointment.StartDateTime = dto.StartDateTime;
            appointment.EndDateTime = dto.EndDateTime;

            await _db.SaveChangesAsync();
            return (true, "data Updated Successfuly.");
        }

    }
}

