using dentist_project.Data;
using dentist_project.DTO;
using dentist_project.DTOs;
using dentist_project.Enums;
using dentist_project.Models;
using dentist_project.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dentist_project.Service
{
    public class PatientService
    {
        private readonly AppDbContext _context;


        public PatientService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<PatientDto>> GetPatients()
        {
            var patients = await _context.Patients
                .Select(p => new PatientDto
                {
                    Id = p.Id,


                    FirstName = p.FirstName,

                    LastName = p.LastName,

                    DateOfBirth = p.DateOfBirth,

                    Gender = p.Gender,

                    Phone = p.Phone,

                    Allergies = p.Allergies,

                    MedicalHistory = p.MedicalHistory,

                    CreatedAt = p.CreatedAt,

                    Balance = p.MedicalRecords
                        .Sum(record =>
                            record.TotalCost > record.PaidAmount
                                ? record.TotalCost - record.PaidAmount
                                : 0m)
                })
                .ToListAsync();

            return patients;
        }
        // DENTAL CHART 
        // DENTAL CHART 
        public async Task<List<DentalChartItemDto>> GetPatientDentalChartAsync(
    int patientId)
        {
            var toothTreatments = await _context.ToothTreatments

                .Include(tt => tt.Tooth)

                .Include(tt => tt.MedicalRecord)

                .Where(tt =>
                    tt.MedicalRecord.PatientId == patientId
                    &&
                    tt.Status == ToothStatus.Completed
                )

                .OrderByDescending(tt => tt.MedicalRecord.CreatedAt)

                .ThenByDescending(tt => tt.Id)

                .ToListAsync();



            var chart = toothTreatments

                .Where(tt => tt.Tooth != null)

                .GroupBy(tt => tt.Tooth!.Number)

                .Select(g =>
                {

                    var latest = g
                        .OrderByDescending(x => x.Id)
                        .First();


                    var item = new DentalChartItemDto
                    {
                        ToothNumber = g.Key,


                        Conditions = g
                            .Where(x => x.Surface == null)
                            .Select(x => x.Condition)
                            .Distinct()
                            .ToList(),


                        Status = latest.Status,

                        TreatmentId = latest.TreatmentId,

                        Notes = latest.Notes,


                        Surfaces = new Dictionary<string, ToothCondition>()

                    };




                    // Surface treatments
                    // Example:
                    // M = Filling
                    // D = Filling
                    foreach (var treatment in g)
                    {

                        if (treatment.Surface.HasValue)
                        {
                            item.Surfaces[
                                treatment.Surface.Value.ToString()
                            ] = treatment.Condition;
                        }

                    }



                    return item;

                })

                .ToList();



            return chart;
        }
        // update for each tooth in dental chart 
        public async Task<(bool Success, string Message)> UpdateToothStatusAsync(
     UpdateToothStatusDto dto)
        {
            // 1. Check patient
            var patientExists = await _context.Patients
                .AnyAsync(p => p.Id == dto.PatientId);

            if (!patientExists)
            {
                return (false, $"Patient {dto.PatientId} not found.");
            }

            // 2. Get latest medical record for this patient
            // Dental chart is patient-wide.
            // We use the latest medical record only because
            // ToothTreatment requires MedicalRecordId.
            var medicalRecord = await _context.MedicalRecords
                .Where(m => m.PatientId == dto.PatientId)
                .OrderByDescending(m => m.CreatedAt)
                .ThenByDescending(m => m.Id)
                .FirstOrDefaultAsync();

            if (medicalRecord == null)
            {
                return (
                    false,
                    $"Patient {dto.PatientId} does not have a medical record."
                );
            }

            // 3. Find tooth
            var tooth = await _context.Teeth
                .FirstOrDefaultAsync(t =>
                    t.Number == dto.ToothNumber);

            if (tooth == null)
            {
                return (
                    false,
                    $"Tooth {dto.ToothNumber} not found."
                );
            }

            // 4. Parse surface
            ToothSurface? surface = null;

            if (!string.IsNullOrWhiteSpace(dto.Surface))
            {
                if (!Enum.TryParse<ToothSurface>(
                    dto.Surface,
                    true,
                    out var parsedSurface))
                {
                    return (
                        false,
                        $"Invalid surface: {dto.Surface}"
                    );
                }

                surface = parsedSurface;
            }

            // 5. Parse condition
            if (!Enum.TryParse<ToothCondition>(
                dto.Condition,
                true,
                out var condition))
            {
                return (
                    false,
                    $"Invalid condition: {dto.Condition}"
                );
            }

            // 6. Parse status
            if (!Enum.TryParse<ToothStatus>(
                dto.Status,
                true,
                out var status))
            {
                return (
                    false,
                    $"Invalid status: {dto.Status}"
                );
            }

            // 7. Find existing tooth treatment
            var existingToothTreatment =
                await _context.ToothTreatments
                    .FirstOrDefaultAsync(tt =>
                        tt.MedicalRecordId == medicalRecord.Id &&
                        tt.ToothId == tooth.Id &&
                        tt.Surface == surface
                    );

            // 8. Update existing
            if (existingToothTreatment != null)
            {
                existingToothTreatment.Condition = condition;
                existingToothTreatment.Status = status;
                existingToothTreatment.TreatmentId = dto.TreatmentId;
                existingToothTreatment.Notes = dto.Notes;
            }
            else
            {
                // 9. Create new
                var toothTreatment = new ToothTreatment
                {
                    MedicalRecordId = medicalRecord.Id,
                    ToothId = tooth.Id,
                    Surface = surface,
                    Condition = condition,
                    Status = status,
                    TreatmentId = dto.TreatmentId,
                    Notes = dto.Notes
                };

                _context.ToothTreatments.Add(toothTreatment);
            }

            // 10. Save
            await _context.SaveChangesAsync();

            return (
                true,
                "Tooth updated successfully."
            );
        }


        // update status for the bridge 
        public async Task<(bool Success, string Message)> UpdateBridgeAsync(
    List<UpdateToothStatusDto> dtos)
        {

            if (dtos == null || dtos.Count < 3)
            {
                return (
                    false,
                    "A conventional bridge requires at least 3 units: 2 abutments and at least 1 pontic."
                );
            }

            // Remove duplicate teeth
            var toothNumbers = dtos
                .Select(x => x.ToothNumber)
                .Distinct()
                .OrderBy(x => x)
                .ToList();

            if (toothNumbers.Count < 3)
            {
                return (
                    false,
                    "A conventional bridge requires at least 3 units: 2 abutments and at least 1 pontic."
                );
            }


            var patientId = dtos.First().PatientId;

            if (dtos.Any(x => x.PatientId != patientId))
            {
                return (
                    false,
                    "All bridge teeth must belong to the same patient."
                );
            }

            var patientExists = await _context.Patients
                .AnyAsync(p => p.Id == patientId);

            if (!patientExists)
            {
                return (
                    false,
                    $"Patient {patientId} not found."
                );
            }

            var upperTeeth = new HashSet<int>
    {
        11, 12, 13, 14, 15, 16, 17, 18,
        21, 22, 23, 24, 25, 26, 27, 28
    };

            var lowerTeeth = new HashSet<int>
    {
        31, 32, 33, 34, 35, 36, 37, 38,
        41, 42, 43, 44, 45, 46, 47, 48
    };

            bool allUpper = toothNumbers.All(t =>
                upperTeeth.Contains(t));

            bool allLower = toothNumbers.All(t =>
                lowerTeeth.Contains(t));

            if (!allUpper && !allLower)
            {
                return (
                    false,
                    "Bridge teeth must be in the same dental arch."
                );
            }

            for (int i = 1; i < toothNumbers.Count; i++)
            {
                if (toothNumbers[i] - toothNumbers[i - 1] != 1)
                {
                    return (
                        false,
                        "Bridge teeth must be consecutive."
                    );
                }
            }


            var medicalRecord = await _context.MedicalRecords
                .Where(m => m.PatientId == patientId)
                .OrderByDescending(m => m.CreatedAt)
                .ThenByDescending(m => m.Id)
                .FirstOrDefaultAsync();

            if (medicalRecord == null)
            {
                return (
                    false,
                    $"Patient {patientId} does not have a medical record."
                );
            }


            var teeth = await _context.Teeth
                .Where(t => toothNumbers.Contains(t.Number))
                .ToListAsync();

            if (teeth.Count != toothNumbers.Count)
            {
                var foundNumbers = teeth
                    .Select(t => t.Number)
                    .ToHashSet();

                var missingTeeth = toothNumbers
                    .Where(n => !foundNumbers.Contains(n))
                    .ToList();

                return (
                    false,
                    $"The following teeth were not found: {string.Join(", ", missingTeeth)}"
                );
            }


            var firstToothNumber = toothNumbers.First();
            var lastToothNumber = toothNumbers.Last();


            foreach (var tooth in teeth)
            {
                var existingToothTreatment =
                    await _context.ToothTreatments
                        .FirstOrDefaultAsync(tt =>
                            tt.MedicalRecordId == medicalRecord.Id &&
                            tt.ToothId == tooth.Id &&
                            tt.Surface == null
                        );

                string role;

                if (tooth.Number == firstToothNumber ||
                    tooth.Number == lastToothNumber)
                {
                    role = "Abutment";
                }
                else
                {
                    role = "Pontic";
                }

                var notes = $"Bridge - {role}";


                if (existingToothTreatment != null)
                {
                    existingToothTreatment.Condition =
                        ToothCondition.Bridge;

                    existingToothTreatment.Status =
                        ToothStatus.Completed;

                    existingToothTreatment.TreatmentId =
                        null;

                    existingToothTreatment.Notes =
                        notes;
                }


                else
                {
                    var toothTreatment = new ToothTreatment
                    {
                        MedicalRecordId = medicalRecord.Id,

                        ToothId = tooth.Id,

                        Surface = null,

                        Condition = ToothCondition.Bridge,

                        Status = ToothStatus.Completed,

                        TreatmentId = null,

                        Notes = notes
                    };

                    _context.ToothTreatments.Add(toothTreatment);
                }
            }


            await _context.SaveChangesAsync();

            return (
                true,
                $"Bridge saved successfully for teeth {string.Join(", ", toothNumbers)}."
            );
        }
        // clear a tooth 
        public async Task<(bool Success, string Message)> ClearToothAsync(
     int patientId,
     int toothNumber)
        {
            var treatments = await _context.ToothTreatments
                .Include(tt => tt.Tooth)
                .Include(tt => tt.MedicalRecord)
                .Where(tt =>
                    tt.MedicalRecord != null &&
                    tt.MedicalRecord.PatientId == patientId &&
                    tt.Tooth != null &&
                    tt.Tooth.Number == toothNumber)
                .ToListAsync();

            if (treatments.Count > 0)
            {
                _context.ToothTreatments.RemoveRange(treatments);
                await _context.SaveChangesAsync();
            }

            return (true, "Tooth cleared successfully.");
        }

        // creating the tratments



        public async Task<(bool Success, string Message, object? Data)> CreateTreatment(
    int patientId,
    CreateTreatmentDto dto,
    ApplicationUser createdByUser,
    string createdID)
        {
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == patientId);

            if (patient == null)
            {
                return (false, "Patient not found.", null);
            }


            if (createdByUser == null || string.IsNullOrWhiteSpace(createdID))
            {
                return (false, "Invalid creator user.", null);
            }


            if (string.IsNullOrWhiteSpace(dto.Treatment))
            {
                return (false, "Treatment name is required.", null);
            }

            if (dto.Price < 0 || dto.PaidAmount < 0)
            {
                return (false, "Price and paid amount cannot be negative.", null);
            }

            if (dto.Price.HasValue && dto.PaidAmount > dto.Price.Value)
            {
                return (false, "Paid amount cannot exceed the treatment price.", null);
            }


            var treatmentName = dto.Treatment.Trim();
            var isCleaningTreatment = IsCleaningTreatment(treatmentName);


            var treatment = await _context.Treatments
                .FirstOrDefaultAsync(t =>
                    t.Name.ToLower() == treatmentName.ToLower()
                    && t.IsActive);

            decimal planTotalCost;

            if (treatment == null)
            {
                planTotalCost = dto.Price ?? 0;
                if (dto.PaidAmount > planTotalCost)
                {
                    return (false, "Paid amount cannot exceed the treatment price.", null);
                }

                treatment = new Treatment
                {
                    Name = treatmentName,
                    Description = null,
                    DefaultPrice = planTotalCost,
                    EstimatedMinutes = 0,
                    IsActive = true,
                    HasRecallReminder = isCleaningTreatment
                };

                _context.Treatments.Add(treatment);
            }
            else
            {
                treatment.HasRecallReminder |= isCleaningTreatment;
                planTotalCost = dto.Price ?? treatment.DefaultPrice;
                if (planTotalCost < 0 || dto.PaidAmount > planTotalCost)
                {
                    return (false, "Paid amount cannot exceed the treatment price.", null);
                }
            }



            var isBridge = treatmentName.Contains(
                "bridge",
                StringComparison.OrdinalIgnoreCase);



            var toothNumbers = dto.ToothNumbers?
                .Distinct()
                .ToList()
                ?? new List<int>();



            if (!isBridge && toothNumbers.Count > 1)
            {
                return (
                    false,
                    "Only one tooth can be selected for this treatment.",
                    null
                );
            }



            if (isBridge && toothNumbers.Count < 3)
            {
                return (
                    false,
                    "A bridge requires at least 3 teeth.",
                    null
                );
            }



            var validTeeth = new HashSet<int>
    {
        11,12,13,14,15,16,17,18,
        21,22,23,24,25,26,27,28,
        31,32,33,34,35,36,37,38,
        41,42,43,44,45,46,47,48
    };



            var invalidTeeth = toothNumbers
                .Where(t => !validTeeth.Contains(t))
                .ToList();


            if (invalidTeeth.Any())
            {
                return (
                    false,
                    $"Invalid tooth number(s): {string.Join(", ", invalidTeeth)}",
                    null
                );
            }



            if (isBridge)
            {
                var bridgeValidation = ValidateBridge(toothNumbers);

                if (!bridgeValidation.Success)
                {
                    return (
                        false,
                        bridgeValidation.Message,
                        null
                    );
                }
            }



            // ===============================
            // MULTIPLE SURFACES
            // ===============================

            var surfaces = new List<ToothSurface>();


            foreach (var s in dto.Surfaces ?? new List<string>())
            {
                if (!Enum.TryParse<ToothSurface>(
                        s.Trim(),
                        true,
                        out var parsedSurface))
                {
                    return (
                        false,
                        $"Invalid tooth surface: {s}",
                        null
                    );
                }


                surfaces.Add(parsedSurface);
            }



            if (surfaces.Any() && toothNumbers.Count == 0)
            {
                return (
                    false,
                    "A surface cannot be specified without a tooth.",
                    null
                );
            }
            if (!TryParseTreatmentStatus(
        dto.Status,
        out var status))
            {
                return (
                    false,
                    "Invalid status. Use Pending, In Progress or Completed.",
                    null
                );
            }



            var condition = GetCondition(treatmentName);


            if (condition == null)
            {
                condition = ToothCondition.Healthy;
            }



            // ===============================
            // LOAD TEETH
            // ===============================

            var teeth = new List<Tooth>();


            if (toothNumbers.Count > 0)
            {
                teeth = await _context.Teeth
                    .Where(t =>
                        toothNumbers.Contains(t.Number))
                    .ToListAsync();



                var foundNumbers = teeth
                    .Select(t => t.Number)
                    .ToHashSet();



                var missingTeeth = toothNumbers
                    .Where(number =>
                        !foundNumbers.Contains(number))
                    .ToList();



                if (missingTeeth.Any())
                {
                    return (
                        false,
                        $"Tooth number(s) not found: {string.Join(", ", missingTeeth)}",
                        null
                    );
                }
            }



            // ===============================
            // CREATE MEDICAL RECORD
            // ===============================

            var medicalRecord = new MedicalRecord
            {
                PatientId = patientId,

                Patient = patient,

                AppointmentId = null,

                Diagnosis = null,

                TreatmentPlan = treatmentName,

                TotalCost = planTotalCost,

                PaidAmount = dto.PaidAmount,

                Prescription = null,

                ClinicalNotes = dto.Notes,

                CreatedAt = DateTime.UtcNow,

                TreatmentDate = dto.TreatmentDate
                    ?? DateOnly.FromDateTime(DateTime.UtcNow),

                CreatedBy = createdByUser,

                CreatedById = createdID
            };


            _context.MedicalRecords.Add(medicalRecord);




            // ===============================
            // CREATE TOOTH TREATMENTS
            // ===============================

            var toothTreatments = new List<ToothTreatment>();


            // General treatment without tooth
            if (toothNumbers.Count == 0)
            {
                toothTreatments.Add(new ToothTreatment
                {
                    MedicalRecord = medicalRecord,

                    ToothId = null,

                    Treatment = treatment,

                    Status = status,

                    Surface = null,

                    Condition = condition.Value,

                    Notes = dto.Notes
                });
            }



            else
            {
                foreach (var toothNumber in toothNumbers)
                {
                    var tooth = teeth.First(
                        t => t.Number == toothNumber
                    );



                    // No surface selected
                    // Example: Crown, Implant
                    if (surfaces.Count == 0)
                    {
                        toothTreatments.Add(new ToothTreatment
                        {
                            MedicalRecord = medicalRecord,

                            ToothId = tooth.Id,

                            Treatment = treatment,

                            Status = status,

                            Surface = null,

                            Condition = condition.Value,

                            Notes = dto.Notes
                        });
                    }



                    // Multiple surfaces
                    // Example: Filling M + O + D
                    else
                    {
                        foreach (var surface in surfaces)
                        {
                            toothTreatments.Add(new ToothTreatment
                            {
                                MedicalRecord = medicalRecord,

                                ToothId = tooth.Id,

                                Treatment = treatment,

                                Status = status,

                                Surface = surface,

                                Condition = condition.Value,

                                Notes = dto.Notes
                            });
                        }
                    }
                }
            }




            _context.ToothTreatments.AddRange(toothTreatments);

            if (isCleaningTreatment)
            {
                var existingCleaningReminders = await _context.Notifications
                    .Where(notification =>
                        notification.PatientId == patientId &&
                        notification.Type == NotificationType.CleaningReminder)
                    .ToListAsync();

                _context.Notifications.RemoveRange(existingCleaningReminders);

                var cleaningDate = DateTime.SpecifyKind(
                    medicalRecord.TreatmentDate
                        .AddMonths(6)
                        .ToDateTime(TimeOnly.MinValue),
                    DateTimeKind.Utc);

                _context.Notifications.Add(new Notification
                {
                    PatientId = patientId,
                    Type = NotificationType.CleaningReminder,
                    Message =
                        $"Cleaning appointment reminder after 6 months: {cleaningDate:yyyy-MM-dd}",
                    IsSent = false,
                    ReminderDate = cleaningDate,
                    IsApproved = false
                });
            }

            await _context.SaveChangesAsync();





            return
            (
                true,

                "Treatment created successfully.",

                new
                {
                    patientId,

                    treatmentId = treatment.Id,

                    treatment = treatment.Name,

                    toothNumbers,

                    surfaces = surfaces
                        .Select(s => s.ToString())
                        .ToList(),

                    status = status.ToString(),

                    price = dto.Price ?? treatment.DefaultPrice,

                    notes = dto.Notes,

                    treatmentDate = medicalRecord.TreatmentDate,

                    medicalRecordId = medicalRecord.Id
                }
            );
        }
        private static bool IsCleaningTreatment(string? treatmentName)
        {
            return treatmentName?.Contains(
                       "clean",
                       StringComparison.OrdinalIgnoreCase) == true
                || treatmentName?.Contains(
                       "scal",
                       StringComparison.OrdinalIgnoreCase) == true;
        }

        private static (bool Success, string Message) ValidateBridge(
            List<int> toothNumbers)
        {
            var teeth = toothNumbers
                .Distinct()
                .OrderBy(x => x)
                .ToList();


           
            if (teeth.Count < 3)
            {
                return (
                    false,
                    "A bridge requires at least 3 teeth."
                );
            }


            var firstDigit = teeth[0] / 10;


            if (teeth.Any(t => t / 10 != firstDigit))
            {
                return (
                    false,
                    "Bridge teeth must belong to the same dental arch."
                );
            }

            if (firstDigit is not (1 or 2 or 3 or 4))
            {
                return (
                    false,
                    "Invalid dental arch."
                );
            }

            for (int i = 1; i < teeth.Count; i++)
            {
                if (teeth[i] != teeth[i - 1] + 1)
                {
                    return (
                        false,
                        "Bridge teeth must be adjacent."
                    );
                }
            }


            return (
                true,
                "Valid bridge."
            );
        }

        private static ToothCondition? GetCondition(
            string treatmentName)
        {
            var name = treatmentName.Trim().ToLower();


            if (name.Contains("bridge"))
                return ToothCondition.Bridge;


            if (name.Contains("root canal"))
                return ToothCondition.RootCanal;


            if (name.Contains("filling"))
                return ToothCondition.Filling;


            if (name.Contains("crown"))
                return ToothCondition.Crown;


            if (name.Contains("implant"))
                return ToothCondition.Implant;


            if (name.Contains("fracture"))
                return ToothCondition.Fracture;


            if (name.Contains("missing"))
                return ToothCondition.Missing;


            if (name.Contains("cavity"))
                return ToothCondition.Cavity;


            if (name.Contains("healthy"))
                return ToothCondition.Healthy;


            // General treatment.
            // The treatment itself does not represent a tooth condition.
            if (name.Contains("cleaning"))
                return ToothCondition.Healthy;


            return null;
        }


        // ===creating the tratments===


        // create an patient 
        public async Task<(bool Success, string Message, PatientDto? Data)> CreatePatient(
    CreatePatientDto dto)
        {
            // Validate name
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return (false, "Patient name is required.", null);
            }

            // Validate phone
            if (string.IsNullOrWhiteSpace(dto.Phone))
            {
                return (false, "Phone number is required.", null);
            }


            //var existingPatient = await _context.Patients
            //    .FirstOrDefaultAsync(p => p.FirstName + " " + p.LastName == dto.Name);

            //if (existingPatient != null)
            //    return (false, "This patient code already exists.", null);

            // Split full name
            var nameParts = dto.Name
                .Trim()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries);

            if (nameParts.Length == 0)
            {
                return (false, "Patient name is required.", null);
            }

            var firstName = nameParts[0];

            var lastName = nameParts.Length > 1
                ? string.Join(" ", nameParts.Skip(1))
                : "";

            // Create patient
            var patient = new Patient
            {
                FirstName = firstName,
                LastName = lastName,
                Phone = dto.Phone.Trim(),
                Gender = string.IsNullOrWhiteSpace(dto.Gender)
                    ? null
                    : dto.Gender.Trim(),
                DateOfBirth = dto.BirthDate,
                MedicalHistory = string.IsNullOrWhiteSpace(dto.Notes)
                    ? null
                    : dto.Notes.Trim(),
                Allergies = null,
                CreatedAt = DateTime.UtcNow
            };

            _context.Patients.Add(patient);

            await _context.SaveChangesAsync();

            // Return created patient
            var patientDto = new PatientDto
            {
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                Phone = patient.Phone,
                Allergies = patient.Allergies,
                MedicalHistory = patient.MedicalHistory,
                CreatedAt = patient.CreatedAt
            };

            return (
                true,
                "Patient created successfully.",
                patientDto
            );
        }
        // === create an patient ===
        //delte patient 
        public async Task<(bool Success, string Message)> DeleteTreatmentAsync(int id)
        {
            // =========================================
            // 1. FIND MEDICAL RECORD
            // =========================================

            var medicalRecord = await _context.MedicalRecords
                .FirstOrDefaultAsync(m => m.Id == id);


            if (medicalRecord == null)
            {
                return
                (
                    false,
                    "Treatment record not found."
                );
            }





            // =========================================
            // 2. GET TOOTH TREATMENTS
            // =========================================

            var toothTreatments = await _context.ToothTreatments
                .Where(t =>
                    t.MedicalRecordId == id)
                .ToListAsync();



            var toothTreatmentIds = toothTreatments
                .Select(t => t.Id)
                .ToList();







            // =========================================
            // 3. DELETE APPOINTMENT-TOOTH LINKS
            // =========================================

            var toothTreatmentLinks = await _context
                .AppointmentTreatmentToothTreatments
                .Where(x =>
                    toothTreatmentIds.Contains(x.ToothTreatmentId))
                .ToListAsync();



            if (toothTreatmentLinks.Any())
            {
                _context.AppointmentTreatmentToothTreatments
                    .RemoveRange(toothTreatmentLinks);
            }







            // =========================================
            // 4. FIND APPOINTMENT TREATMENTS
            // =========================================

            var treatmentIds = toothTreatments
                .Where(t => t.TreatmentId != null)
                .Select(t => t.TreatmentId!.Value)
                .ToList();



            var appointmentTreatments = await _context.AppointmentTreatments
                .Where(at =>
                    treatmentIds.Contains(at.TreatmentId))
                .ToListAsync();



            var appointmentIds = appointmentTreatments
                .Select(at => at.AppointmentId)
                .Distinct()
                .ToList();







            // =========================================
            // 5. DELETE APPOINTMENT TREATMENTS
            // =========================================

            if (appointmentTreatments.Any())
            {
                _context.AppointmentTreatments
                    .RemoveRange(appointmentTreatments);
            }







            // =========================================
            // 6. DELETE APPOINTMENTS
            // =========================================

            var appointments = await _context.Appointments
                .Where(a =>
                    appointmentIds.Contains(a.Id))
                .ToListAsync();



            if (appointments.Any())
            {

                // Remove MedicalRecord -> Appointment reference
                var linkedMedicalRecords = await _context.MedicalRecords
                    .Where(m =>
                        m.AppointmentId != null &&
                        appointmentIds.Contains(m.AppointmentId.Value))
                    .ToListAsync();



                foreach (var record in linkedMedicalRecords)
                {
                    record.AppointmentId = null;
                }



                // Save FK changes first because relationship is Restrict
                await _context.SaveChangesAsync();




                foreach (var appointment in appointments)
                {
                    appointment.TotalCost = 0;

                    appointment.PaidAmount = 0;

                    appointment.RemainingAmount = 0;

                    appointment.PaymentStatus =
                        PaymentStatus.Unpaid;
                }



                _context.Appointments
                    .RemoveRange(appointments);
            }







            // =========================================
            // 7. DELETE TOOTH TREATMENTS
            // =========================================

            if (toothTreatments.Any())
            {
                _context.ToothTreatments
                    .RemoveRange(toothTreatments);
            }







            // =========================================
            // 8. DELETE MEDICAL RECORD
            // =========================================

            _context.MedicalRecords
                .Remove(medicalRecord);






            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("================ DELETE ERROR ================");

                Console.WriteLine(ex.Message);

                Console.WriteLine("INNER:");
                Console.WriteLine(ex.InnerException?.Message);

                Console.WriteLine("==============================================");

                throw;
            }






            return
            (
                true,
                "Treatment and all related data deleted successfully."
            );
        }
        public async Task<(bool Success, string Message)> DeletePatientAsync(int id)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == id);


            if (patient == null)
            {
                return (
                    false,
                    "Patient not found."
                );
            }


            var medicalRecords = await _context.MedicalRecords
                .Where(m => m.PatientId == id)
                .ToListAsync();

            var appointments = await _context.Appointments
                .Where(a => a.PatientId == id)
                .ToListAsync();

            var appointmentIds = appointments
                .Select(a => a.Id)
                .ToList();

            foreach (var record in medicalRecords)
            {
                record.AppointmentId = null;
            }

            if (medicalRecords.Any())
            {
                await _context.SaveChangesAsync();
            }

            var medicalRecordIds = medicalRecords
                .Select(m => m.Id)
                .ToList();


            var toothTreatments = await _context.ToothTreatments
                .Where(t =>
                    medicalRecordIds.Contains(t.MedicalRecordId))
                .ToListAsync();


            if (toothTreatments.Any())
            {
                _context.ToothTreatments.RemoveRange(
                    toothTreatments
                );
            }



            if (medicalRecords.Any())
            {
                _context.MedicalRecords.RemoveRange(
                    medicalRecords
                );
            }

            var appointmentTreatments =
                await _context.AppointmentTreatments
                .Where(at =>
                    appointmentIds.Contains(
                        at.AppointmentId))
                .ToListAsync();


            if (appointmentTreatments.Any())
            {
                _context.AppointmentTreatments.RemoveRange(
                    appointmentTreatments
                );
            }



            if (appointments.Any())
            {
                _context.Appointments.RemoveRange(
                    appointments
                );
            }



            _context.Patients.Remove(patient);


            await _context.SaveChangesAsync();
            await transaction.CommitAsync();


            return (
                true,
                "Patient and all related data deleted successfully."
            );
        }

        public async Task<(bool Success, string Message)> UpdateTreatmentStatusAsync(
    int id,
    string status)
        {
            var toothTreatments = await _context.ToothTreatments
                .Include(t => t.Treatment)
                .Where(t => t.MedicalRecordId == id)
                .ToListAsync();


            if (!toothTreatments.Any())
            {
                return (
                    false,
                    "Treatment not found."
                );
            }


            if (!Enum.TryParse<ToothStatus>(
                status,
                true,
                out var newStatus))
            {
                return (
                    false,
                    "Invalid status."
                );
            }


            foreach (var toothTreatment in toothTreatments)
            {
                toothTreatment.Status = newStatus;
            }
            foreach (var toothTreatment in toothTreatments)
            {
                toothTreatment.Status = newStatus;
            }



            // Get medical record
            var medicalRecord = await _context.MedicalRecords
                .FirstOrDefaultAsync(m => m.Id == id);

            var isCleaningTreatment = toothTreatments.Any(t =>
                IsCleaningTreatment(t.Treatment?.Name));


            if (medicalRecord == null)
            {
                return (
                    false,
                    "Medical record not found."
                );
            }



            // ==========================================
            // REMOVE CLEANING REMINDER
            // if treatment is not completed anymore
            // ==========================================

            if (newStatus != ToothStatus.Completed && !isCleaningTreatment)
            {

                var cleaningReminders = await _context.Notifications
                    .Where(n =>
                        n.PatientId == medicalRecord.PatientId &&
                        n.Type == NotificationType.CleaningReminder
                    )
                    .ToListAsync();


                if (cleaningReminders.Any())
                {
                    _context.Notifications.RemoveRange(cleaningReminders);
                }

            }





            // ==========================================
            // CREATE 6 MONTH CLEANING REMINDER
            // when treatment becomes completed
            // ==========================================

            if (newStatus == ToothStatus.Completed)
            {

                var hasReminder = await _context.Notifications
                    .AnyAsync(n =>
                        n.PatientId == medicalRecord.PatientId &&
                        n.Type == NotificationType.CleaningReminder
                    );


                if (!hasReminder)
                {

                    var cleaningDate = DateTime.SpecifyKind(
                        medicalRecord.TreatmentDate
                            .AddMonths(6)
                            .ToDateTime(TimeOnly.MinValue),
                        DateTimeKind.Utc);



                    var notification = new Notification
                    {

                        PatientId = medicalRecord.PatientId,


                        AppointmentId = medicalRecord.AppointmentId,


                        Type = NotificationType.CleaningReminder,


                        Message =
                            $"Cleaning appointment reminder after 6 months: {cleaningDate:yyyy-MM-dd}",


                        IsSent = false,
                        ReminderDate = cleaningDate,

                        IsApproved = false

                    };


                    _context.Notifications.Add(notification);

                }

            

        }

            await _context.SaveChangesAsync();


            return (
                true,
                "Treatment status updated successfully."
            );
        }
        public async Task<List<object>> GetPatientTreatmentsAsync(int patientId)
        {
            var treatments = await _context.ToothTreatments

                .Include(x => x.Treatment)

                .Include(x => x.Tooth)

                .Include(x => x.MedicalRecord)
                    .ThenInclude(x => x.Appointment)
                        .ThenInclude(x => x.AppointmentTreatments)


                .Where(x =>
                    x.MedicalRecord.PatientId == patientId
                    &&
                    x.Status == ToothStatus.Completed
                )


                .GroupBy(x => new
                {
                    x.MedicalRecordId,
                    x.TreatmentId
                })


                .Select(g => new
                {

                    id = g.First().Id,

                    medicalRecordId = g.First().MedicalRecordId,


                    treatment =
                        g.First().Treatment != null
                        ?
                        g.First().Treatment.Name
                        :
                        "Unknown",



                    // REMOVE DUPLICATED TEETH
                    teeth =
                        g.Where(x => x.Tooth != null)
                        .Select(x => x.Tooth!.Number)
                        .Distinct()
                        .ToList(),




                    // ALL SURFACES
                    // Example:
                    // M,O,D
                    surfaces =
                        g.Where(x => x.Surface != null)
                        .Select(x => x.Surface!.ToString())
                        .Distinct()
                        .ToList(),




                    status =
                        g.First().Status.ToString(),




                    condition =
                        g.First().Condition.ToString(),



                    cost = g.First().MedicalRecord.TotalCost,

                    paid = g.First().MedicalRecord.PaidAmount,

                    remaining =
                        g.First().MedicalRecord.TotalCost
                            > g.First().MedicalRecord.PaidAmount
                            ? g.First().MedicalRecord.TotalCost
                                - g.First().MedicalRecord.PaidAmount
                            : 0m,

                    paymentStatus =
                        g.First().MedicalRecord.PaidAmount <= 0
                            ? "Unpaid"
                            : g.First().MedicalRecord.PaidAmount
                                >= g.First().MedicalRecord.TotalCost
                                ? "Paid"
                                : "Partially Paid",





                    notes =
                        g.First().Notes,




                    date =
                        g.First().MedicalRecord.TreatmentDate

                })


                .OrderByDescending(x => x.date)


                .ToListAsync();



            return treatments
                .Cast<object>()
                .ToList();
        }
        public async Task<(bool Success, string Message, object? Data)>
            AddTreatmentPaymentAsync(int patientId, int medicalRecordId, decimal amount)
        {
            if (amount <= 0)
            {
                return (false, "Payment amount must be greater than zero.", null);
            }

            var updatedRows = await _context.MedicalRecords
                .Where(record =>
                    record.Id == medicalRecordId
                    && record.PatientId == patientId
                    && record.PaidAmount + amount <= record.TotalCost)
                .ExecuteUpdateAsync(updates =>
                    updates.SetProperty(
                        record => record.PaidAmount,
                        record => record.PaidAmount + amount));

            if (updatedRows == 0)
            {
                var existingRecord = await _context.MedicalRecords
                    .AsNoTracking()
                    .FirstOrDefaultAsync(record =>
                        record.Id == medicalRecordId
                        && record.PatientId == patientId);

                if (existingRecord == null)
                {
                    return (false, "Treatment plan not found.", null);
                }

                return (
                    false,
                    $"Payment amount cannot exceed the remaining balance of {Math.Max(existingRecord.TotalCost - existingRecord.PaidAmount, 0):0.00}.",
                    null);
            }

            var updatedRecord = await _context.MedicalRecords
                .AsNoTracking()
                .FirstAsync(record =>
                    record.Id == medicalRecordId
                    && record.PatientId == patientId);

            var remaining = Math.Max(
                updatedRecord.TotalCost - updatedRecord.PaidAmount,
                0);
            var paymentStatus = updatedRecord.PaidAmount <= 0
                ? "Unpaid"
                : updatedRecord.PaidAmount >= updatedRecord.TotalCost
                    ? "Paid"
                    : "Partially Paid";

            return (
                true,
                "Treatment payment registered successfully.",
                new
                {
                    updatedRecord.TotalCost,
                    updatedRecord.PaidAmount,
                    Remaining = remaining,
                    PaymentStatus = paymentStatus
                });
        }

        public async Task<List<object>> GetNormalPatientTreatmentsAsync(int patientId)
        {
            var treatments = await _context.ToothTreatments

                .Include(x => x.Treatment)

                .Include(x => x.Tooth)

                .Include(x => x.MedicalRecord)
                    .ThenInclude(x => x.Appointment)
                        .ThenInclude(x => x.AppointmentTreatments)


                .Where(x =>
                    x.MedicalRecord.PatientId == patientId
                )


                .GroupBy(x => new
                {
                    x.MedicalRecordId,
                    x.TreatmentId
                })


                .Select(g => new
                {
                    id = g.First().Id,

                    medicalRecordId = g.First().MedicalRecordId,


                    treatment =
                        g.First().Treatment != null
                        ?
                        g.First().Treatment.Name
                        :
                        "Unknown",




                    // REMOVE DUPLICATED TEETH
                    teeth =
                        g.Where(x => x.Tooth != null)
                         .Select(x => x.Tooth!.Number)
                         .Distinct()
                         .ToList(),




                    // GET ALL SURFACES
                    // Example:
                    // M + O
                    surfaces =
                        g.Where(x => x.Surface.HasValue)
                         .Select(x => x.Surface!.Value.ToString())
                         .Distinct()
                         .ToList(),




                    status =
                        g.First().Status.ToString(),




                    condition =
                        g.First().Condition.ToString(),




                    cost = g.First().MedicalRecord.TotalCost,

                    paid = g.First().MedicalRecord.PaidAmount,

                    remaining =
                        g.First().MedicalRecord.TotalCost
                            > g.First().MedicalRecord.PaidAmount
                            ? g.First().MedicalRecord.TotalCost
                                - g.First().MedicalRecord.PaidAmount
                            : 0m,

                    paymentStatus =
                        g.First().MedicalRecord.PaidAmount <= 0
                            ? "Unpaid"
                            : g.First().MedicalRecord.PaidAmount
                                >= g.First().MedicalRecord.TotalCost
                                ? "Paid"
                                : "Partially Paid",




                    notes =
                        g.First().Notes,




                    date =
                        g.First().MedicalRecord.TreatmentDate

                })


                .OrderByDescending(x => x.date)


                .ToListAsync();



            return treatments
                .Cast<object>()
                .ToList();
        }
        public async Task<List<object>> GetCompletedTreatmentsAsync(
    int patientId)
        {
            var treatments = await _context.ToothTreatments

                .Include(t => t.Tooth)

                .Include(t => t.Treatment)

                .Include(t => t.MedicalRecord)
                    .ThenInclude(m => m.Appointment)
                        .ThenInclude(a => a!.AppointmentTreatments)
                            .ThenInclude(at => at.ToothTreatmentLinks)



                .Where(t =>
                    t.MedicalRecord.PatientId == patientId
                    &&
                    t.Status == ToothStatus.Completed
                )



                .GroupBy(t => new
                {
                    t.MedicalRecordId,
                    t.TreatmentId
                })



                .Select(g => new
                {

                    id = g.First().MedicalRecordId,



                    treatment =
                        g.First().Treatment != null
                        ?
                        g.First().Treatment!.Name
                        :
                        "Unknown",




                    // REMOVE DUPLICATED TEETH
                    // Example:
                    // Before: [33,33]
                    // After:  [33]
                    teeth =
                        g.Where(x => x.Tooth != null)
                         .Select(x => x.Tooth!.Number)
                         .Distinct()
                         .ToList(),




                    // ALL SURFACES
                    // Example:
                    // Filling M + O
                    surfaces =
                        g.Where(x => x.Surface.HasValue)
                         .Select(x => x.Surface!.Value.ToString())
                         .Distinct()
                         .ToList(),




                    cost = g.First().MedicalRecord.TotalCost,

                    paid = g.First().MedicalRecord.PaidAmount,

                    remaining =
                        g.First().MedicalRecord.TotalCost
                            > g.First().MedicalRecord.PaidAmount
                            ? g.First().MedicalRecord.TotalCost
                                - g.First().MedicalRecord.PaidAmount
                            : 0m,

                    paymentStatus =
                        g.First().MedicalRecord.TotalCost <= 0 ||
                        g.First().MedicalRecord.PaidAmount <= 0
                            ? "Unpaid"
                            : g.First().MedicalRecord.PaidAmount
                                >= g.First().MedicalRecord.TotalCost
                                ? "Paid"
                                : "Partially Paid",





                    status =
                        g.First().Status.ToString(),





                    condition =
                        g.First().Condition.ToString(),





                    date =
                        g.First().MedicalRecord.CreatedAt,





                    notes =
                        g.First().Notes

                })



                .OrderByDescending(x => x.date)



                .ToListAsync();





            return treatments
                .Cast<object>()
                .ToList();
        }
        private static bool TryParseTreatmentStatus(
    string status,
    out ToothStatus result)
        {
            result = ToothStatus.NeedsTreatment;


            if (string.IsNullOrWhiteSpace(status))
            {
                return false;
            }


            switch (status.Trim().ToLower())
            {
                case "pending":
                case "needs treatment":
                case "needstreatment":

                    result = ToothStatus.NeedsTreatment;
                    return true;


                case "in progress":
                case "inprogress":

                    result = ToothStatus.InProgress;
                    return true;


                case "completed":

                    result = ToothStatus.Completed;
                    return true;


                case "healthy":

                    result = ToothStatus.Healthy;
                    return true;


                case "extracted":

                    result = ToothStatus.Extracted;
                    return true;


                default:
                    return false;
            }
        }
        public async Task<object> GetPatientSummaryAsync(int patientId)
        {
            var lastAppointment = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .OrderByDescending(a => a.StartDateTime)
                .FirstOrDefaultAsync();


            var upcomingAppointments = await _context.Appointments
                .CountAsync(a =>
                    a.PatientId == patientId &&
                    a.StartDateTime > DateTime.UtcNow &&
                    a.Status != AppointmentStatus.Completed &&
                    a.Status != AppointmentStatus.Cancelled
                );


            return new
            {
                balance = await _context.MedicalRecords
                    .Where(record => record.PatientId == patientId)
                    .SumAsync(record =>
                        record.TotalCost > record.PaidAmount
                            ? record.TotalCost - record.PaidAmount
                            : 0m),

                upcomingAppointments = upcomingAppointments,

                lastVisit = lastAppointment?.StartDateTime
            };
        }


    }
}
