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
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();
            return patients;

        }
        // DENTAL CHART 
        public async Task<List<DentalChartItemDto>> GetPatientDentalChartAsync(
      int patientId)
        {
            var toothTreatments = await _context.ToothTreatments
                .Include(tt => tt.Tooth)
                .Include(tt => tt.MedicalRecord)
                .Where(tt => tt.MedicalRecord.PatientId == patientId)
                .OrderByDescending(tt => tt.MedicalRecord.CreatedAt)
                .ThenByDescending(tt => tt.Id)
                .ToListAsync();

            var latestTreatments = toothTreatments
                .GroupBy(tt => new
                {
                    tt.ToothId,
                    tt.Surface
                })
                .Select(g => g.First())
                .Select(tt => new DentalChartItemDto
                {
                    ToothNumber = tt.Tooth.Number,
                    Surface = tt.Surface,
                    Condition = tt.Condition,
                    Status = tt.Status,
                    TreatmentId = tt.TreatmentId,
                    Notes = tt.Notes
                })
                .ToList();

            return latestTreatments;
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

            var treatmentName = dto.Treatment.Trim();


            var treatment = await _context.Treatments
                .FirstOrDefaultAsync(t =>
                    t.Name.ToLower() == treatmentName.ToLower()
                    && t.IsActive);

            if (treatment == null)
            {
                treatment = new Treatment
                {
                    Name = treatmentName,
                    Description = null,
                    DefaultPrice = dto.Price ?? 0,
                    EstimatedMinutes = 0,
                    IsActive = true
                };

                _context.Treatments.Add(treatment);

                // We need the Treatment ID later
                await _context.SaveChangesAsync();
            }

            var isBridge = treatmentName.Contains(
                "bridge",
                StringComparison.OrdinalIgnoreCase
            );


            
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
        11, 12, 13, 14, 15, 16, 17, 18,
        21, 22, 23, 24, 25, 26, 27, 28,
        31, 32, 33, 34, 35, 36, 37, 38,
        41, 42, 43, 44, 45, 46, 47, 48
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


          
            ToothSurface? surface = null;

            if (!string.IsNullOrWhiteSpace(dto.Surface))
            {
                if (!Enum.TryParse<ToothSurface>(
                        dto.Surface.Trim(),
                        true,
                        out var parsedSurface))
                {
                    return (
                        false,
                        "Invalid tooth surface. Use M, O, D, B or L.",
                        null
                    );
                }

                surface = parsedSurface;
            }


            
            if (surface.HasValue && toothNumbers.Count == 0)
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

            // For general treatments such as:
            // Cleaning, Whitening, Consultation, Fluoride, etc.
            // there is no specific tooth condition.
            //
            // We use Healthy as the default condition.
            //
            // IMPORTANT:
            // This does NOT mean the tooth is clinically healthy.
            // It simply means the treatment itself does not represent
            // a dental condition such as Cavity, Crown, Filling, etc.

            if (condition == null)
            {
                condition = ToothCondition.Healthy;
            }


            // ============================================================
            // 15. Load Teeth From Database
            // ============================================================
            //
            // IMPORTANT:
            // We do this BEFORE creating MedicalRecord.
            // Therefore, if a tooth does not exist, nothing is saved.

            var teeth = new List<Tooth>();

            if (toothNumbers.Count > 0)
            {
                teeth = await _context.Teeth
                    .Where(t => toothNumbers.Contains(t.Number))
                    .ToListAsync();

                var foundNumbers = teeth
                    .Select(t => t.Number)
                    .ToHashSet();

                var missingTeeth = toothNumbers
                    .Where(number => !foundNumbers.Contains(number))
                    .ToList();

                if (missingTeeth.Any())
                {
                    return (
                        false,
                        $"Tooth number(s) not found in the database: {string.Join(", ", missingTeeth)}",
                        null
                    );
                }
            }


            // ============================================================
            // 16. Create Medical Record
            // ============================================================
            //
            // Appointment is OPTIONAL.
            //
            // This treatment can be created directly from the patient page
            // without an appointment.

            var medicalRecord = new MedicalRecord
            {
                PatientId = patientId,

                AppointmentId = null,

                Diagnosis = null,

                TreatmentPlan = treatmentName,

                Prescription = null,

                ClinicalNotes = dto.Notes,

                CreatedAt = DateTime.UtcNow,

                CreatedBy = createdByUser,

                CreatedById = createdID
            };

            _context.MedicalRecords.Add(medicalRecord);

            await _context.SaveChangesAsync();

            var toothTreatments = new List<ToothTreatment>();

            if (toothNumbers.Count == 0)
            {
                toothTreatments.Add(new ToothTreatment
                {
                    MedicalRecordId = medicalRecord.Id,

                    ToothId = null,

                    TreatmentId = treatment.Id,

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

                    toothTreatments.Add(new ToothTreatment
                    {
                        MedicalRecordId = medicalRecord.Id,

                        ToothId = tooth.Id,

                        TreatmentId = treatment.Id,

                        Status = status,

                        Surface = surface,

                        Condition = condition.Value,

                        Notes = dto.Notes
                    });
                }
            }


          
            _context.ToothTreatments.AddRange(toothTreatments);

            await _context.SaveChangesAsync();


            return (
                true,
                "Treatment created successfully.",
                new
                {
                    patientId,

                    treatmentId = treatment.Id,

                    treatment = treatment.Name,

                    toothNumbers,

                    surface = surface?.ToString(),

                    status = status.ToString(),

                    price = dto.Price ?? treatment.DefaultPrice,

                    notes = dto.Notes,

                    medicalRecordId = medicalRecord.Id
                }
            );
        }


      
        private static bool TryParseTreatmentStatus(
            string? value,
            out ToothStatus status)
        {
            status = ToothStatus.NeedsTreatment;

            if (string.IsNullOrWhiteSpace(value))
            {
                return false;
            }

            switch (value.Trim().ToLower())
            {
                case "pending":

                    status = ToothStatus.NeedsTreatment;

                    return true;


                case "in progress":

                    status = ToothStatus.InProgress;

                    return true;


                case "completed":

                    status = ToothStatus.Completed;

                    return true;


                default:

                    return false;
            }
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
    }
}
