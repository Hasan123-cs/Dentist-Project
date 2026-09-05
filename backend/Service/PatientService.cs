using dentist_project.Data;
using dentist_project.DTO;
using dentist_project.DTOs;
using dentist_project.Models;
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
        public async Task<(bool success, string message)> CreatePatientAsync(
    CreatePatientDto dto)
        {


            var nameParts = dto.FullName
                .Trim()
                .Split(" ");



            var firstName = nameParts[0];


            var lastName =
                nameParts.Length > 1
                ? string.Join(" ", nameParts.Skip(1))
                : "";




            var patient = new Patient
            {


                FirstName = firstName,


                LastName = lastName,


                Phone = dto.Phone ?? "",


                Gender = dto.Gender,


                DateOfBirth = dto.DateOfBirth,


                Allergies = dto.Allergies,


                MedicalHistory = dto.MedicalHistory,


                CreatedAt = DateTime.UtcNow


            };




            _context.Patients.Add(patient);



            await _context.SaveChangesAsync();



            return (
                true,
                "Patient created successfully"
            );


        }
    }
}
