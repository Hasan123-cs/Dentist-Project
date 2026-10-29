    using dentist_project.Data;
    using dentist_project.DTO;
    using dentist_project.DTOs;
    using dentist_project.Models;
    using dentist_project.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
using Superpower;


namespace dentist_project.Controllers;


    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {

        private readonly AppDbContext _context;
        private readonly PatientService _service;

        private readonly UserManager<ApplicationUser> _userManager;
        public PatientsController(
            AppDbContext context,
            PatientService service
            , UserManager<ApplicationUser> userManager
        )
        {
            _userManager = userManager;
            _context = context;
            _service = service;
        }





        [HttpGet]
        public async Task<IActionResult> GetPatients()
        {

            var patients = await _service.GetPatients();

            return Ok(patients);

        }



        [HttpGet("search/{keyword}")]
        public async Task<IActionResult> SearchPatient(string keyword)
        {
        if(keyword.Contains("Extraction"))
        {
            keyword = keyword.Replace("Extraction", "missing");
        }
        var query = _context.Patients.AsQueryable();

        if (int.TryParse(keyword, out int id))
        {
            Console.WriteLine("id is +++++++++++++++++++++++++"+id);
            query = query.Where(p =>
                p.Id == id ||
                p.FirstName.Contains(keyword) ||
                p.LastName.Contains(keyword));
        }
        else
        {
            query = query.Where(p =>
                p.FirstName.Contains(keyword) ||
                p.LastName.Contains(keyword));
        }

        var patients = await query.ToListAsync();


       

            return Ok(patients);

        }



        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {


            var patient = await _context.Patients
                .FirstOrDefaultAsync(
                    p => p.Id == id
                );


            if (patient == null)
                return NotFound();



            return Ok(patient);

        }

    // create patient 
    [HttpPost]
    public async Task<IActionResult> CreatePatient(
    [FromBody] CreatePatientDto dto)
    {
        try
        {
            var result = await _service.CreatePatient(dto);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                data = result.Data
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine("========== CREATE PATIENT ERROR ==========");
            Console.WriteLine(ex.ToString());
            Console.WriteLine("==========================================");

            return StatusCode(500, new
            {
                message = "Error creating patient.",
                error = ex.Message
            });
        }
    }

    [HttpPost("{id:int}/treatments")]
    public async Task<IActionResult> CreateTreatment(
  int id,
  [FromBody] CreateTreatmentDto dto)
    {
        try
        {
            var createdID = _userManager.GetUserId(User);

            if (string.IsNullOrWhiteSpace(createdID))
            {
                return Unauthorized(new
                {
                    message = "User is not authenticated."
                });
            }

            var createdByUser = await _userManager.FindByIdAsync(createdID);

            if (createdByUser == null)
            {
                return Unauthorized(new
                {
                    message = "Creator user not found."
                });
            }

            var result = await _service.CreateTreatment(
                id,
                dto,
                createdByUser,
                createdID
            );

            if (!result.Success)
            {
                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                data = result.Data
            });
        }
        catch (DbUpdateException ex)
        {
            Console.WriteLine("========== CREATE TREATMENT DATABASE ERROR ==========");
            Console.WriteLine(ex.ToString());
            Console.WriteLine("======================================================");

            return StatusCode(500, new
            {
                message = "Treatment could not be saved. Apply pending database migrations, then try again."
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine("========== CREATE TREATMENT ERROR ==========");
            Console.WriteLine(ex.ToString());
            Console.WriteLine("============================================");

            return StatusCode(500, new
            {
                message = "Error creating treatment.",
                error = ex.Message
            });
        }
    }
    [Authorize]
    [HttpPost("{id:int}/treatments/{medicalRecordId:int}/payments")]
    public async Task<IActionResult> AddTreatmentPayment(
        int id,
        int medicalRecordId,
        [FromBody] RegisterTreatmentPaymentDto dto)
    {
        try
        {
            var result = await _service.AddTreatmentPaymentAsync(
                id,
                medicalRecordId,
                dto.Amount);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new
            {
                message = result.Message,
                data = result.Data
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine("========== TREATMENT PAYMENT ERROR ==========");
            Console.WriteLine(ex.ToString());
            Console.WriteLine("==============================================");

            return StatusCode(500, new
            {
                message = "Error registering treatment payment.",
                error = ex.Message
            });
        }
    }

    [HttpGet("all-treatments")]
   
    public async Task<IActionResult> GetAllTreatments()
    {
        var treatments = await _context.MedicalRecords

     .Include(m => m.Patient)

     .Include(m => m.ToothTreatments)
         .ThenInclude(t => t.Tooth)

     .Include(m => m.ToothTreatments)
         .ThenInclude(t => t.Treatment)

     .OrderByDescending(m => m.CreatedAt)


     .Select(m => new
     {
         id = m.Id,

         patientId = m.PatientId,


         patient =
             m.Patient.FirstName + " " + m.Patient.LastName,


         treatment =
             m.ToothTreatments
                 .Where(t => t.Treatment != null)
                 .Select(t => t.Treatment!.Name)
                 .FirstOrDefault(),



         tooth =
             m.ToothTreatments
                 .Where(t => t.Tooth != null)
                 .Select(t => t.Tooth!.Number)
                 .ToList(),



         status =
             m.ToothTreatments
                 .Select(t => t.Status.ToString())
                 .FirstOrDefault(),



         price = m.TotalCost,
         notes = m.ClinicalNotes,


         date = m.TreatmentDate,


         // PAYMENT FROM LAST APPOINTMENT
         totalPrice = m.TotalCost,

         remainingAmount = m.TotalCost > m.PaidAmount
             ? m.TotalCost - m.PaidAmount
             : 0m

     })
     .ToListAsync();


        return Ok(treatments);
    }
    
    [HttpDelete("treatments/{id}")]
    public async Task<IActionResult> DeleteTreatment(int id)
    {
        try
        {
            var result =
                await _service.DeleteTreatmentAsync(id);


            if (!result.Success)
            {
                return NotFound(new
                {
                    message = result.Message
                });
            }


            return Ok(new
            {
                message = result.Message
            });

        }
        catch (Exception ex)
        {
            Console.WriteLine("================ DELETE TREATMENT ERROR ================");

            Console.WriteLine("MESSAGE:");
            Console.WriteLine(ex.Message);


            Console.WriteLine("---------------- INNER EXCEPTION ----------------");

            Console.WriteLine(
                ex.InnerException?.Message
            );


            Console.WriteLine("---------------- FULL ERROR ----------------");

            Console.WriteLine(
                ex.ToString()
            );


            Console.WriteLine("========================================================");


            return StatusCode(500, new
            {
                message = "Error deleting treatment.",

                error = ex.Message,

                inner = ex.InnerException?.Message
            });
        }
    }
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        try
        {
            var result = await _service.DeletePatientAsync(id);


            if (!result.Success)
            {
                return NotFound(new
                {
                    message = result.Message
                });
            }


            return Ok(new
            {
                message = result.Message
            });

        }
        catch (Exception ex)
        {
            Console.WriteLine("========== DELETE PATIENT ERROR ==========");
            Console.WriteLine(ex.ToString());
            Console.WriteLine("===========================================");

            return StatusCode(500, new
            {
                message = "Error deleting patient.",
                error = ex.Message
            });
        }
    }
    [HttpPut("treatments/{id}/status")]
    public async Task<IActionResult> UpdateTreatmentStatus(
    int id,
    [FromBody] string status)
    {
        var result =
            await _service.UpdateTreatmentStatusAsync(
                id,
                status);


        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }


        return Ok(new
        {
            message = result.Message
        });
    }
    //
    // treatment 
    [HttpGet("search-treatments")]
    public async Task<IActionResult> SearchTreatments(
     [FromQuery] string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return await GetAllTreatments();
        }
        if(keyword.Contains("Extraction"))
        {
            keyword = keyword.Replace("Extraction", "missing");
        }

        keyword = keyword.ToLower();



        var treatments = await _context.MedicalRecords

            .Include(m => m.Patient)

            .Include(m => m.ToothTreatments)
                .ThenInclude(t => t.Treatment)

            .Include(m => m.ToothTreatments)
                .ThenInclude(t => t.Tooth)



            .Where(m =>

                (
                    m.Patient.FirstName + " " +
                    m.Patient.LastName
                )
                .ToLower()
                .Contains(keyword)



                ||

                m.ToothTreatments.Any(t =>
                    t.Treatment != null &&
                    t.Treatment.Name
                        .ToLower()
                        .Contains(keyword)
                )



                ||

                m.ToothTreatments.Any(t =>
                    t.Tooth != null &&
                    t.Tooth.Number
                        .ToString()
                        .Contains(keyword)
                )

            )



            .OrderByDescending(m => m.CreatedAt)



            .Select(m => new
            {

                id = m.Id,


                patientId = m.PatientId,


                patient =
                    m.Patient.FirstName
                    + " "
                    + m.Patient.LastName,



                treatment =
                    m.ToothTreatments
                        .Where(t => t.Treatment != null)
                        .Select(t => t.Treatment!.Name)
                        .FirstOrDefault(),



                tooth =
                    m.ToothTreatments
                        .Where(t => t.Tooth != null)
                        .Select(t => t.Tooth!.Number)
                        .ToList(),



                status =
                    m.ToothTreatments
                        .Select(t => t.Status.ToString())
                        .FirstOrDefault(),



                price = m.TotalCost,



                notes = m.ClinicalNotes,



                date = m.TreatmentDate,



                totalPrice = m.TotalCost,

                remainingAmount = m.TotalCost > m.PaidAmount
                    ? m.TotalCost - m.PaidAmount
                    : 0m

            })

            .ToListAsync();



        return Ok(treatments);
    }
    // == serach treatment ==
    // here we get the total revenue with secure endpoint 
    [Authorize(Roles = "Doctor")]
    [HttpGet("dashboard-revenue")]
    public async Task<IActionResult> GetDashboardRevenue()
    {
        var totalRevenue = await _context.MedicalRecords
            .SumAsync(record => record.PaidAmount);

        return Ok(new
        {
            totalRevenue
        });
    }

    [HttpGet("{id}/treatments")]
    public async Task<IActionResult> GetPatientTreatments(int id)
    {
        try
        {
            var treatments =
                await _service.GetNormalPatientTreatmentsAsync(id);


            return Ok(treatments);
        }

        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Error loading patient treatments.",
                error = ex.Message
            });
        }
    }

    [HttpGet("{id}/summary")]
    public async Task<IActionResult> GetPatientSummary(int id)
    {
        try
        {
            var result =
                await _service.GetPatientSummaryAsync(id);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Error loading patient summary.",
                error = ex.Message
            });
        }
    }


    [HttpGet("{id}/patient-phone")]
    public async Task<IActionResult> GetPatientPhone(int id)
    {
        var appointment = await _context.Appointments
            .Include(a => a.Patient)
            .FirstOrDefaultAsync(a => a.Id == id);


        if (appointment == null)
        {
            return NotFound(new
            {
                message = "Appointment not found"
            });
        }


        var phone = appointment.ContactPhone ?? appointment.Patient?.Phone;

        return Ok(new
        {
            phone
        });
    }
    [HttpGet("{id}/completed-treatments")]
    public async Task<IActionResult> GetCompletedTreatments(int id)
    {
        try
        {
            var treatments =
                await _service.GetCompletedTreatmentsAsync(id);

            return Ok(treatments);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Error loading completed treatments.",
                error = ex.Message
            });
        }
    
}




    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdatePatient(
        int id,
        [FromBody] UpdatePatientDto dto)
    {
        var patient = await _context.Patients
            .FirstOrDefaultAsync(p => p.Id == id);

        if (patient == null)
        {
            return NotFound(new
            {
                message = "Patient not found."
            });
        }

        if (dto.Name != null)
        {
            var nameParts = dto.Name
                .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            if (nameParts.Length == 0)
            {
                return BadRequest(new
                {
                    message = "Patient name is required."
                });
            }

            patient.FirstName = nameParts[0];
            patient.LastName = string.Join(" ", nameParts.Skip(1));
        }

        // Phone is optional
        // null = do not change
        // "" = clear phone
        if (dto.Phone != null)
        {
            patient.Phone = dto.Phone.Trim();
        }

        if (dto.DateOfBirth != null)
        {
            patient.DateOfBirth = dto.DateOfBirth;
        }

        // Medical Notes are optional
        // null = do not change
        // "" = clear notes
        if (dto.Notes != null)
        {
            patient.MedicalHistory = dto.Notes.Trim();
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Patient updated successfully."
        });
    }



}