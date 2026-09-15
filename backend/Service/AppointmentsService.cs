
using dentist_project.Data;
using dentist_project.DTO;
using dentist_project.Enums;
using dentist_project.Models;
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
            Console.WriteLine($"START RECEIVED: {start}");
            Console.WriteLine($"START KIND: {start.Kind}");

            Console.WriteLine($"END RECEIVED: {end}");
            Console.WriteLine($"END KIND: {end.Kind}");
            var startUtc = DateTime.SpecifyKind(start, DateTimeKind.Utc);
            var endUtc = DateTime.SpecifyKind(end, DateTimeKind.Utc);
            Console.WriteLine($"START UTC: {startUtc}");
            Console.WriteLine($"END UTC: {endUtc}");

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
            var test = await _db.Appointments
    .Where(a => a.StartDateTime < endUtc &&
                a.EndDateTime > startUtc)
    .Select(a => a.Id)
    .ToListAsync();

            Console.WriteLine("IDS FOUND: " + string.Join(", ", test));
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
        public async Task<(bool success, string message)> CancelAppointmentAsync(int id)
        {
            var appointment = await _db.Appointments
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return (false, "Appointment not found.");
            }

            if (appointment.Status == AppointmentStatus.Cancelled)
            {
                return (false, "Appointment is already cancelled.");
            }

            if (appointment.Status == AppointmentStatus.Completed)
            {
                return (false, "Completed appointment cannot be cancelled.");
            }

            appointment.Status = AppointmentStatus.Cancelled;

            await _db.SaveChangesAsync();

            return (true, "Appointment cancelled successfully.");
        }
        // add the new appointment by default scheduled 
// Add a new appointment with Scheduled status
public async Task<(bool sucsess, string message)> CreateAppointmentAsync(
    CreateAppointmentDto dto,
    string userId)
        {
           
            var patient = await _db.Patients
                .FirstOrDefaultAsync(p =>
                    (p.FirstName + " " + p.LastName).ToLower()
                    == dto.PatientName.Trim().ToLower());

            if (patient == null)
            {
                return (false, "Patient not found.");
            }


            var treatment = await _db.Treatments
                .FirstOrDefaultAsync(t =>
                    t.Name.ToLower()
                    == dto.TreatmentName.Trim().ToLower());

            if (treatment == null)
            {
                return (false, "Treatment not found.");
            }



            if (dto.EndTime <= dto.StartTime)
            {
                return (false, "End time must be after start time.");
            }


            var clinicStart = new TimeOnly(9, 0);
            var clinicEnd = new TimeOnly(20, 0);

            if (dto.StartTime < clinicStart)
            {
                return (false, "Appointment cannot start before 09:00.");
            }

            if (dto.EndTime > clinicEnd)
            {
                return (false, "Appointment cannot end after 20:00.");
            }


            
            var lebanonTimeZone = OperatingSystem.IsWindows()
                ? TimeZoneInfo.FindSystemTimeZoneById(
                    "Middle East Standard Time")
                : TimeZoneInfo.FindSystemTimeZoneById(
                    "Asia/Beirut");


            var localStartDateTime =
                dto.Date.ToDateTime(dto.StartTime);

            localStartDateTime = DateTime.SpecifyKind(
                localStartDateTime,
                DateTimeKind.Unspecified);



            var localEndDateTime =
                dto.Date.ToDateTime(dto.EndTime);

            localEndDateTime = DateTime.SpecifyKind(
                localEndDateTime,
                DateTimeKind.Unspecified);


          
            var startDateTime = TimeZoneInfo.ConvertTimeToUtc(
                localStartDateTime,
                lebanonTimeZone);

            var endDateTime = TimeZoneInfo.ConvertTimeToUtc(
                localEndDateTime,
                lebanonTimeZone);


            // ==========================================
            // 9. Check appointment overlap
            // ==========================================
            //
            // Existing:
            //
            //       10:00 -------- 10:30
            //
            // New:
            //
            //       10:20 -------- 11:00
            //
            // This is NOT allowed.
            //
            // But:
            //
            //       10:00 -------- 10:30
            //                         10:30 -------- 11:00
            //
            // This IS allowed.
            //

            var hasOverlap = await _db.Appointments
                .AnyAsync(a =>
                    a.Status != AppointmentStatus.Cancelled
                    &&
                    a.StartDateTime < endDateTime
                    &&
                    a.EndDateTime > startDateTime
                );

            if (hasOverlap)
            {
                return (
                    false,
                    "The selected time overlaps with another appointment."
                );
            }


            // 10. Create appointment

            var appointment = new Appointment
            {
                PatientId = patient.Id,

                //   doctor / assistant from JWT
                CreatedById = userId,

                StartDateTime = startDateTime,
                EndDateTime = endDateTime,

                Status = AppointmentStatus.Pending,

                TotalCost = treatment.DefaultPrice,
                // its represent the remaining 
                AmountPaid = treatment.DefaultPrice,

                PaymentStatus = Enums.PaymentStatus.Unpaid
            };


            // 11. Attach treatment to appointment

            var appointmentTreatment = new AppointmentTreatment
            {
                Appointment = appointment,

                TreatmentId = treatment.Id,

                Price = treatment.DefaultPrice
            };

            appointment.AppointmentTreatments.Add(
                appointmentTreatment
            );

            _db.Appointments.Add(appointment);

            await _db.SaveChangesAsync();


            return (
                true,
                "Appointment added successfully."
            );
        }
public async Task<(bool Success, string Message, object? Data)>
    CompleteAppointmentAsync(
        int appointmentId,
        CompleteAppointmentDto dto)
        {
            var appointment = await _db.Appointments
                .Include(a => a.Patient)
                .Include(a => a.AppointmentTreatments)
                    .ThenInclude(at => at.Treatment)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
                return (false, "Appointment not found.", null);

            if (appointment.Status == AppointmentStatus.Cancelled)
                return (false, "Cancelled appointment cannot be completed.", null);

            if (appointment.Status == AppointmentStatus.Completed)
                return (false, "Appointment is already completed.", null);

            if (dto.PaymentStatus != "Unpaid" &&
                dto.PaymentStatus != "Paid")
            {
                return (false, "Invalid payment status.", null);
            }

            if (dto.PaidAmount < 0)
                return (false, "Paid amount cannot be negative.", null);

            if (dto.PaymentStatus == "Unpaid")
            {
                dto.PaidAmount = 0;
            }

            if (dto.PaymentStatus == "Paid" &&
                dto.PaidAmount <= 0)
            {
                return (false, "Enter the amount paid.", null);
            }

            if (dto.PaidAmount > appointment.TotalCost)
            {
                return (false,
                    "Paid amount cannot be greater than the treatment price.",
                    null);
            }

            var totalCost = appointment.TotalCost;
            var remaining = appointment.TotalCost - dto.PaidAmount;
            // AmountPaid stores the REMAINING amount
            appointment.AmountPaid = remaining;
            appointment.PaymentStatus =
                dto.PaymentStatus == "Paid"
                    ? Enums.PaymentStatus.Paid
                    : Enums.PaymentStatus.Unpaid;

            // --------------------------------
            // IMPORTANT
            // --------------------------------
            // We only change the price when
            // payment is Paid.
            //
            // Example:
            // TotalCost = 100
            // PaidAmount = 10
            // New TotalCost = 90
            //
            // If Unpaid:
            // TotalCost stays 100.
            // --------------------------------

           

            appointment.Status = AppointmentStatus.Completed;

            await _db.SaveChangesAsync();


            return (
                true,
                "Appointment completed successfully.",
                new
                {
                    appointment.Id,
                    appointment.Status,
                    appointment.TotalCost,
                    appointment.AmountPaid,
                    appointment.PaymentStatus,
                    Remaining = remaining
                }
            );
        }
public async Task<(bool Success, string Message, object? Data)>
    GetAppointmentByIdAsync(int id)
        {
            var appointment = await _db.Appointments
                .Include(a => a.Patient)
                .Include(a => a.AppointmentTreatments)
                    .ThenInclude(at => at.Treatment)
                .Include(a => a.CreatedBy)

                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return (
                    false,
                    "Appointment not found.",
                    null
                );
            }

            var treatment = appointment.AppointmentTreatments
                .FirstOrDefault();

            return (
                true,
                "Appointment loaded successfully.",
                new
                {
                    id = appointment.Id,

                    patientName = appointment.Patient.FirstName
                                 + " "
                                 + appointment.Patient.LastName,

                    treatmentName = treatment?.Treatment?.Name,

                    date = appointment.StartDateTime
                        .ToLocalTime()
                        .ToString("yyyy-MM-dd"),

                    startDateTime = appointment.StartDateTime,

                    endDateTime = appointment.EndDateTime,

                    status = appointment.Status.ToString(),

                    totalCost = appointment.TotalCost,

                    amountPaid = appointment.TotalCost - appointment.AmountPaid,

                    paymentStatus = appointment.PaymentStatus.ToString(),

                    notes = appointment.Notes,

                    createdBy = appointment.CreatedBy != null
    ? $"{appointment.CreatedBy.FirstName} {appointment.CreatedBy.LastName}"
    : "-",
                    remaining = appointment.AmountPaid
                }
            );
        }


    }
}


