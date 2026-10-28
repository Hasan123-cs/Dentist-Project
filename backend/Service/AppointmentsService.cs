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

            var startUtc = DateTime.SpecifyKind(
                start,
                DateTimeKind.Utc);


            var endUtc = DateTime.SpecifyKind(
                end,
                DateTimeKind.Utc);



            var rawData = await _db.Appointments
                .AsNoTracking()
                .Where(a =>
                    a.StartDateTime < endUtc
                    &&
                    a.EndDateTime > startUtc
                )
                .OrderBy(a => a.StartDateTime)
                .Select(a => new
                {
                    a.Id,

                    a.PatientId,

                    PatientFirstName = a.Patient != null
                        ? a.Patient.FirstName
                        : null,

                    PatientLastName = a.Patient != null
                        ? a.Patient.LastName
                        : null,

                    a.ContactName,

                    ContactPhone = a.ContactPhone,

                    PatientPhone = a.Patient != null
                        ? a.Patient.Phone
                        : null,

                    a.StartDateTime,

                    a.EndDateTime,

                    a.Type,

                    a.Status,

                    a.TotalCost,

                    a.Notes
                })
                .ToListAsync();



            var appointmentsList = rawData.Select(a =>
            {

                var localStart =
                    a.StartDateTime.ToLocalTime();


                var localEnd =
                    a.EndDateTime.ToLocalTime();


                return new AppointmentDto
                {
                    Id = a.Id,

                    PatientId = a.PatientId,

                    PatientName = !string.IsNullOrWhiteSpace(a.ContactName)
                        ? a.ContactName
                        : $"{a.PatientFirstName} {a.PatientLastName}".Trim(),

                    Phone = a.ContactPhone ?? a.PatientPhone,


                    StartDateTime =
                        a.StartDateTime,

                    EndDateTime =
                        a.EndDateTime,


                    AppointmentDate =
                        localStart.ToString("yyyy-MM-dd"),


                    StartTime =
                        localStart.ToString("HH:mm:ss"),


                    EndTime =
                        localEnd.ToString("HH:mm:ss"),


                    Status =
                        a.Status.ToString(),

                    AppointmentType =
                        a.Type.ToString(),


                    TotalCost =
                        a.TotalCost,


                    Notes = a.Notes
                };

            }).ToList();



            var todayStart = DateTime.UtcNow.Date;

            var todayEnd =
                todayStart.AddDays(1);



            var todayAppointments =
                await _db.Appointments
                .Where(a =>
                    a.StartDateTime >= todayStart
                    &&
                    a.StartDateTime < todayEnd
                )
                .ToListAsync();



            return new AppointmentResponseDto
            {
                TotalToday =
                    todayAppointments.Count,


                Completed =
                    todayAppointments.Count(a =>
                        a.Status == AppointmentStatus.Completed),


                InProgress =
                    todayAppointments.Count(a =>
                        a.StartDateTime <= DateTime.UtcNow
                        &&
                        a.EndDateTime >= DateTime.UtcNow),


                Scheduled =
                    todayAppointments.Count(a =>
                        a.Status == AppointmentStatus.Pending),


                Appointments =
                    appointmentsList
            };
        }





        public async Task<(bool success, string message)>
            UpdateAppointmentTimeAsync(
                int appointmentId,
                UpdateAppointmentTimeDto dto)
        {

            if (dto.EndDateTime <= dto.StartDateTime)
            {
                return (
                    false,
                    "End time must be after start time."
                );
            }



            var appointment =
                await _db.Appointments
                .FirstOrDefaultAsync(a =>
                    a.Id == appointmentId);



            if (appointment == null)
            {
                return (
                    false,
                    "Appointment not found."
                );
            }



            appointment.StartDateTime =
                dto.StartDateTime;


            appointment.EndDateTime =
                dto.EndDateTime;



            await _db.SaveChangesAsync();


            return (
                true,
                "Appointment updated successfully."
            );
        }





        public async Task<(bool success, string message)>
            CancelAppointmentAsync(int id)
        {

            var appointment =
                await _db.Appointments
                .FirstOrDefaultAsync(a =>
                    a.Id == id);



            if (appointment == null)
            {
                return (
                    false,
                    "Appointment not found."
                );
            }



            if (appointment.Status ==
                AppointmentStatus.Completed)
            {
                return (
                    false,
                    "Completed appointment cannot be cancelled."
                );
            }



            appointment.Status =
                AppointmentStatus.Cancelled;



            await _db.SaveChangesAsync();



            return (
                true,
                "Appointment cancelled successfully."
            );
        }
        public async Task<(bool sucsess, string message)> CreateAppointmentAsync(
      CreateAppointmentDto dto,
      string userId)
        {
            if (string.IsNullOrWhiteSpace(dto.PatientName))
            {
                return (false, "Patient name is required.");
            }

            if (!Enum.TryParse<AppointmentType>(
                    dto.AppointmentType,
                    true,
                    out var appointmentType))
            {
                return (false, "Invalid appointment type.");
            }

            var patient = await _db.Patients
                .FirstOrDefaultAsync(p =>
                    (p.FirstName + " " + p.LastName).ToLower()
                    ==
                    dto.PatientName.Trim().ToLower());

            if (appointmentType == AppointmentType.Treatment && patient == null)
            {
                return (false, "Patient not found.");
            }

            if (appointmentType == AppointmentType.Checkup &&
                string.IsNullOrWhiteSpace(dto.PatientPhone))
            {
                return (false, "Phone number is required for a checkup appointment.");
            }

            var contactName = dto.PatientName.Trim();
            var contactPhone = string.IsNullOrWhiteSpace(dto.PatientPhone)
                ? patient?.Phone
                : dto.PatientPhone.Trim();

            Treatment? treatment = null;
            if (appointmentType == AppointmentType.Treatment)
            {
                if (string.IsNullOrWhiteSpace(dto.TreatmentName))
                {
                    return (false, "Treatment name is required.");
                }

                treatment = await _db.Treatments
                    .FirstOrDefaultAsync(t =>
                        t.Name.ToLower()
                        ==
                        dto.TreatmentName.Trim().ToLower()
                        &&
                        t.IsActive);

                if (treatment == null)
                    return (false, "Treatment not found.");
            }





            var startLocal =
                DateTime.SpecifyKind(
                    dto.Date.ToDateTime(dto.StartTime),
                    DateTimeKind.Unspecified);


            var endLocal =
                DateTime.SpecifyKind(
                    dto.Date.ToDateTime(dto.EndTime),
                    DateTimeKind.Unspecified);



            var timezone =
                OperatingSystem.IsWindows()
                ?
                TimeZoneInfo.FindSystemTimeZoneById(
                    "Middle East Standard Time")
                :
                TimeZoneInfo.FindSystemTimeZoneById(
                    "Asia/Beirut");



            var startDateTime =
                TimeZoneInfo.ConvertTimeToUtc(
                    startLocal,
                    timezone);



            var endDateTime =
                TimeZoneInfo.ConvertTimeToUtc(
                    endLocal,
                    timezone);





            var hasOverlap =
                await _db.Appointments.AnyAsync(a =>
                    a.Status != AppointmentStatus.Cancelled
                    &&
                    a.StartDateTime < endDateTime
                    &&
                    a.EndDateTime > startDateTime);



            if (hasOverlap)
            {
                return (
                    false,
                    "The selected time overlaps with another appointment."
                );
            }








            // =====================================
            // FIND SELECTED TOOTH TREATMENTS
            // =====================================

            var selectedToothTreatments = new List<ToothTreatment>();
            if (treatment != null)
            {
                selectedToothTreatments =
                    await _db.ToothTreatments
                        .Include(tt => tt.MedicalRecord)
                        .Include(tt => tt.Tooth)
                        .Where(tt =>
                            tt.MedicalRecord.PatientId == patient!.Id
                            && tt.TreatmentId == treatment.Id
                            && (
                                dto.ToothNumbers == null ||
                                dto.ToothNumbers.Count == 0 ||
                                (
                                    tt.Tooth != null
                                    && dto.ToothNumbers.Contains(tt.Tooth.Number)
                                )
                                || tt.Tooth == null
                            )
                            && tt.Status != ToothStatus.Completed)
                        .ToListAsync();
            }





            Console.WriteLine("======================");

            Console.WriteLine(
                $"FOUND TOOTH TREATMENTS: {selectedToothTreatments.Count}"
            );


            foreach (var tt in selectedToothTreatments)
            {
                Console.WriteLine(
                    $"TT ID: {tt.Id} | Tooth: {tt.Tooth?.Number}"
                );
            }

            Console.WriteLine("======================");


            var linkedTreatmentPlans = selectedToothTreatments
                .Select(toothTreatment => toothTreatment.MedicalRecord)
                .DistinctBy(record => record.Id)
                .ToList();

            if (appointmentType == AppointmentType.Treatment &&
                linkedTreatmentPlans.Count == 0)
            {
                return (
                    false,
                    $"This patient does not have an active {treatment!.Name} treatment plan for the selected tooth. Create the treatment plan first, or choose Checkup / Consultation.");
            }

            var appointmentTotalCost = linkedTreatmentPlans.Count > 0
                ? linkedTreatmentPlans.Sum(record => record.TotalCost)
                : 0;

            var appointmentPaidAmount = linkedTreatmentPlans.Count > 0
                ? linkedTreatmentPlans.Sum(record => record.PaidAmount)
                : 0;

            var appointmentRemainingAmount = Math.Max(
                appointmentTotalCost - appointmentPaidAmount,
                0);

            var appointment = new Appointment
            {
                PatientId = patient?.Id,

                ContactName = contactName,

                ContactPhone = contactPhone,

                CreatedById = userId,

                StartDateTime = startDateTime,

                EndDateTime = endDateTime,

                Type = appointmentType,

                Status = AppointmentStatus.Pending,

                TotalCost = appointmentTotalCost,

                PaidAmount = appointmentPaidAmount,

                RemainingAmount = appointmentRemainingAmount,

                PaymentStatus = appointmentTotalCost > 0 &&
                    appointmentRemainingAmount <= 0
                    ? Enums.PaymentStatus.Paid
                    : appointmentPaidAmount > 0
                        ? Enums.PaymentStatus.PartiallyPaid
                        : Enums.PaymentStatus.Unpaid
            };


            if (treatment != null)
            {
                var appointmentTreatment = new AppointmentTreatment
                {
                    Appointment = appointment,
                    TreatmentId = treatment.Id,
                    Price = appointmentTotalCost,
                    PaidAmount = appointmentPaidAmount,
                    Status = TreatmentStatus.Planned
                };

                foreach (var toothTreatment in selectedToothTreatments)
                {
                    appointmentTreatment.ToothTreatmentLinks.Add(
                        new AppointmentTreatmentToothTreatment
                        {
                            AppointmentTreatment = appointmentTreatment,
                            ToothTreatment = toothTreatment,
                            ToothTreatmentId = toothTreatment.Id
                        });
                }

                appointment.AppointmentTreatments.Add(appointmentTreatment);
            }



            _db.Appointments.Add(appointment);






            // =====================================
            // FIRST SAVE
            // Creates Appointment ID
            // =====================================

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("======================");
                Console.WriteLine("FIRST SAVE ERROR");
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.InnerException?.Message);
                Console.WriteLine("======================");

                throw;
            }








            // =====================================
            // LINK MEDICAL RECORD
            // AppointmentId exists now
            // =====================================

            foreach (var toothTreatment in selectedToothTreatments)
            {
                toothTreatment.MedicalRecord.AppointmentId =
                    appointment.Id;
            }





            // =====================================
            // SECOND SAVE
            // =====================================

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("======================");
                Console.WriteLine("SECOND SAVE ERROR");
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.InnerException?.Message);
                Console.WriteLine("======================");

                throw;
            }









            if (patient != null)
            {
                var notification = new Notification
                {
                    PatientId = patient.Id,
                    AppointmentId = appointment.Id,
                    Type = NotificationType.AppointmentReminder,
                    Message =
                        $"Appointment : {appointment.StartDateTime.ToLocalTime():yyyy-MM-dd HH:mm}",
                    IsSent = false,
                    IsApproved = false
                };

                _db.Notifications.Add(notification);
                await _db.SaveChangesAsync();
            }






            return
            (
                true,
                "Appointment added successfully."
            );
        }
        public async Task<(bool Success, string Message, object? Data)>
            CompleteAppointmentAsync(
                int appointmentId,
                CompleteAppointmentDto dto)
        {
            var appointment =
                await _db.Appointments

                .Include(a => a.AppointmentTreatments)
                    .ThenInclude(treatment => treatment.ToothTreatmentLinks)
                        .ThenInclude(link => link.ToothTreatment)
                            .ThenInclude(toothTreatment => toothTreatment.MedicalRecord)

                .FirstOrDefaultAsync(a =>
                    a.Id == appointmentId);



            if (appointment == null)
            {
                return (
                    false,
                    "Appointment not found.",
                    null
                );
            }

            var treatmentPlans = appointment.AppointmentTreatments
                .SelectMany(treatment => treatment.ToothTreatmentLinks)
                .Select(link => link.ToothTreatment.MedicalRecord)
                .DistinctBy(record => record.Id)
                .Where(record => record.TotalCost > 0)
                .ToList();

            if (treatmentPlans.Count > 0)
            {
                appointment.TotalCost = treatmentPlans.Sum(record => record.TotalCost);
                appointment.PaidAmount = treatmentPlans.Sum(record => record.PaidAmount);
                appointment.RemainingAmount = treatmentPlans.Sum(record =>
                    Math.Max(record.TotalCost - record.PaidAmount, 0));
            }

            if (dto.PaidAmount < 0)
            {
                return (false, "Paid amount cannot be negative.", null);
            }

            var remainingPayment = dto.PaidAmount;
            var orderedPlans = treatmentPlans.OrderBy(record => record.Id).ToList();
            foreach (var plan in orderedPlans)
            {
                if (remainingPayment <= 0)
                {
                    break;
                }

                var planBalance = Math.Max(plan.TotalCost - plan.PaidAmount, 0);
                var paymentForPlan = Math.Min(planBalance, remainingPayment);
                plan.PaidAmount += paymentForPlan;
                remainingPayment -= paymentForPlan;
            }

            if (remainingPayment > 0 && orderedPlans.Count > 0)
            {
                orderedPlans[^1].PaidAmount += remainingPayment;
            }

            appointment.PaidAmount += dto.PaidAmount;
            appointment.RemainingAmount = Math.Max(
                appointment.RemainingAmount - dto.PaidAmount,
                0);
            appointment.PaymentStatus = appointment.TotalCost > 0 &&
                appointment.RemainingAmount <= 0
                ? Enums.PaymentStatus.Paid
                : appointment.PaidAmount > 0
                    ? Enums.PaymentStatus.PartiallyPaid
                    : Enums.PaymentStatus.Unpaid;

            foreach (var treatment in appointment.AppointmentTreatments)
            {
                treatment.PaidAmount +=
                    dto.PaidAmount;


                // Appointment session completed only
                treatment.Status =
                    TreatmentStatus.Completed;


                treatment.CompletedAt =
                    DateTime.UtcNow;
            }





            // IMPORTANT:
            // DO NOT TOUCH ToothTreatment STATUS
            // Treatment Plan stays InProgress





            appointment.Status =
                AppointmentStatus.Completed;



            await _db.SaveChangesAsync();




            return
            (
                true,
                "Appointment completed successfully.",
                new
                {
                    appointment.Id,

                    appointment.Status,

                    appointment.TotalCost,

                    appointment.PaidAmount,

                    appointment.RemainingAmount,

                    appointment.PaymentStatus
                }
            );
        }






        public async Task<(bool Success, string Message, object? Data)>
    GetAppointmentByIdAsync(int id)
        {
            var appointment =
                await _db.Appointments

                .Include(a => a.Patient)

                .Include(a => a.CreatedBy)

                .Include(a => a.AppointmentTreatments)
                    .ThenInclude(at => at.Treatment)

                .Include(a => a.AppointmentTreatments)
                    .ThenInclude(at => at.ToothTreatmentLinks)
                        .ThenInclude(link => link.ToothTreatment)
                            .ThenInclude(toothTreatment => toothTreatment.MedicalRecord)

                .FirstOrDefaultAsync(a =>
                    a.Id == id);



            if (appointment == null)
            {
                return
                (
                    false,
                    "Appointment not found.",
                    null
                );
            }



            var treatment =
                appointment.AppointmentTreatments
                .FirstOrDefault();

            var treatmentPlans = appointment.AppointmentTreatments
                .SelectMany(appointmentTreatment => appointmentTreatment.ToothTreatmentLinks)
                .Select(link => link.ToothTreatment.MedicalRecord)
                .DistinctBy(record => record.Id)
                .Where(record => record.TotalCost > 0)
                .ToList();

            var totalCost = treatmentPlans.Count > 0
                ? treatmentPlans.Sum(record => record.TotalCost)
                : appointment.TotalCost;
            var paidAmount = treatmentPlans.Count > 0
                ? treatmentPlans.Sum(record => record.PaidAmount)
                : appointment.PaidAmount;
            var remainingAmount = treatmentPlans.Count > 0
                ? treatmentPlans.Sum(record =>
                    Math.Max(record.TotalCost - record.PaidAmount, 0))
                : appointment.RemainingAmount;
            var paymentStatus = totalCost > 0 && remainingAmount <= 0
                ? Enums.PaymentStatus.Paid
                : paidAmount > 0
                    ? Enums.PaymentStatus.PartiallyPaid
                    : Enums.PaymentStatus.Unpaid;


            return
            (
                true,

                "Appointment loaded successfully.",

                new
                {
                    id = appointment.Id,


                    patientName = !string.IsNullOrWhiteSpace(appointment.ContactName)
                        ? appointment.ContactName
                        : appointment.Patient == null
                            ? "Unknown patient"
                            : appointment.Patient.FirstName
                                + " "
                                + appointment.Patient.LastName,

                    createdBy =
                        appointment.CreatedBy != null
                        ?
                        appointment.CreatedBy.FirstName
                        + " "
                        + appointment.CreatedBy.LastName
                        :
                        "-",



                    startDateTime =
                        appointment.StartDateTime,



                    endDateTime =
                        appointment.EndDateTime,



                    status =
                        appointment.Status.ToString(),

                    appointmentType =
                        appointment.Type.ToString(),

                    treatmentName =
                        appointment.Type == AppointmentType.Checkup
                            ? "Checkup / Consultation"
                            : treatment?.Treatment?.Name,


                    notes =
                        appointment.Notes,



                    totalCost,



                    paidAmount,



                    remaining =
                        remainingAmount,



                    paymentStatus =
                        paymentStatus.ToString()
                }
            );
        }

    }
}