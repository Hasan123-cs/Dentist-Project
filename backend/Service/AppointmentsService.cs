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

                var localStart =
                    a.StartDateTime.ToLocalTime();


                var localEnd =
                    a.EndDateTime.ToLocalTime();


                return new AppointmentDto
                {
                    Id = a.Id,

                    PatientId = a.PatientId,

                    PatientName =
                        $"{a.PatientFirstName} {a.PatientLastName}".Trim(),

                    Phone = a.Phone,


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
            var patient = await _db.Patients
                .FirstOrDefaultAsync(p =>
                    (p.FirstName + " " + p.LastName).ToLower()
                    ==
                    dto.PatientName.Trim().ToLower());


            if (patient == null)
                return (false, "Patient not found.");



            var treatment = await _db.Treatments
                .FirstOrDefaultAsync(t =>
                    t.Name.ToLower()
                    ==
                    dto.TreatmentName.Trim().ToLower()
                    &&
                    t.IsActive);



            if (treatment == null)
                return (false, "Treatment not found.");





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

            var selectedToothTreatments =
                await _db.ToothTreatments

                .Include(tt => tt.MedicalRecord)

                .Include(tt => tt.Tooth)

                .Where(tt =>

                    tt.MedicalRecord.PatientId == patient.Id

                    &&

                    tt.TreatmentId == treatment.Id

                    &&

                    (
                        (
                            tt.Tooth != null
                            &&
                            dto.ToothNumbers != null
                            &&
                            dto.ToothNumbers.Contains(tt.Tooth.Number)
                        )

                        ||

                        (
                            tt.Tooth == null
                        )
                    )

                    &&

                    tt.Status != ToothStatus.Completed

                )

                .ToListAsync();





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








            var appointment = new Appointment
            {
                PatientId = patient.Id,

                CreatedById = userId,

                StartDateTime = startDateTime,

                EndDateTime = endDateTime,

                Status = AppointmentStatus.Pending,

                TotalCost = treatment.DefaultPrice,

                PaidAmount = 0,

                RemainingAmount = treatment.DefaultPrice,

                PaymentStatus = Enums.PaymentStatus.Unpaid
            };









            var appointmentTreatment =
                new AppointmentTreatment
                {
                    Appointment = appointment,

                    TreatmentId = treatment.Id,

                    Price = treatment.DefaultPrice,

                    PaidAmount = 0,

                    Status = TreatmentStatus.Planned
                };









            // =====================================
            // CREATE APPOINTMENT <-> TOOTH LINKS
            // =====================================

            foreach (var toothTreatment in selectedToothTreatments)
            {
                appointmentTreatment.ToothTreatmentLinks.Add(
                    new AppointmentTreatmentToothTreatment
                    {
                        AppointmentTreatment = appointmentTreatment,

                        ToothTreatment = toothTreatment,

                        ToothTreatmentId = toothTreatment.Id
                    }
                );
            }





            Console.WriteLine(
                $"LINK COUNT: {appointmentTreatment.ToothTreatmentLinks.Count}"
            );







            appointment.AppointmentTreatments.Add(
                appointmentTreatment
            );



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





            appointment.PaidAmount += dto.PaidAmount;


            appointment.RemainingAmount -=
                dto.PaidAmount;



            appointment.PaymentStatus =
                dto.PaidAmount > 0
                ?
                Enums.PaymentStatus.Paid
                :
                Enums.PaymentStatus.Unpaid;





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

                .Include(a => a.AppointmentTreatments)
                    .ThenInclude(at => at.Treatment)

                .FirstOrDefaultAsync(a =>
                    a.Id == id);



            if (appointment == null)
            {
                return (
                    false,
                    "Appointment not found.",
                    null
                );
            }




            var treatment =
                appointment.AppointmentTreatments
                .FirstOrDefault();




            return
            (
                true,

                "Appointment loaded successfully.",

                new
                {
                    id = appointment.Id,


                    patientName =
                        appointment.Patient.FirstName
                        +
                        " "
                        +
                        appointment.Patient.LastName,


                    treatmentName =
                        treatment?.Treatment?.Name,


                    status =
                        appointment.Status.ToString(),


                    totalCost =
                        appointment.TotalCost,


                    paidAmount =
                        appointment.PaidAmount,


                    remaining =
                        appointment.RemainingAmount,


                    paymentStatus =
                        appointment.PaymentStatus.ToString()
                }
            );
        }

    }
}