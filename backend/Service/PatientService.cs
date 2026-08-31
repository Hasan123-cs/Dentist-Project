using dentist_project.Data;
using dentist_project.DTO;
using dentist_project.DTOs;
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
            return await _context.ToothTreatments
                .Include(tt => tt.Tooth)
                .Where(tt => tt.MedicalRecord.PatientId == patientId)
                .Select(tt => new DentalChartItemDto
                {
                    ToothNumber = tt.Tooth.Number,
                    Surface = tt.Surface,
                    Condition = tt.Condition,
                    Status = tt.Status,
                    TreatmentId = tt.TreatmentId,
                    Notes = tt.Notes
                })
                .ToListAsync();
        }
    }
}
