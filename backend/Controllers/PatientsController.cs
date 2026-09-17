    using dentist_project.Data;
    using dentist_project.DTO;
    using dentist_project.DTOs;
    using dentist_project.Models;
    using dentist_project.Service;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;


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


            var patient = await _context.Patients
                .FirstOrDefaultAsync(
                    p =>
                    p.FirstName.Contains(keyword)
                    ||
                    p.LastName.Contains(keyword)
                );



            if (patient == null)
                return NotFound();



            return Ok(patient);

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



         price =
             m.ToothTreatments
                 .Where(t => t.Treatment != null)
                 .Select(t => t.Treatment!.DefaultPrice)
                 .FirstOrDefault(),
         notes = m.ClinicalNotes,


         date = m.CreatedAt,


         // PAYMENT FROM LAST APPOINTMENT
         totalPrice =
    m.AppointmentId != null
        ? _context.Appointments
            .Where(a => a.Id == m.AppointmentId)
            .Select(a => a.TotalCost)
            .FirstOrDefault()
        :
        m.ToothTreatments
            .Where(t => t.Treatment != null)
            .Select(t => t.Treatment!.DefaultPrice)
            .FirstOrDefault(),


     


         remainingAmount =
    m.AppointmentId != null
        ? _context.Appointments
            .Where(a => a.Id == m.AppointmentId)
            .Select(a => a.RemainingAmount)
            .FirstOrDefault()
        :
        m.ToothTreatments
            .Where(t => t.Treatment != null)
            .Select(t => t.Treatment!.DefaultPrice)
            .FirstOrDefault()

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
            return StatusCode(500, new
            {
                message = "Error deleting treatment.",
                error = ex.Message
            });
        }
    }
}