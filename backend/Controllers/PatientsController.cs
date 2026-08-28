using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dentist_project.Data;
using dentist_project.Models;
using dentist_project.DTOs;
using dentist_project.Service;


namespace dentist_project.Controllers;


[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{

    private readonly AppDbContext _context;
    private readonly PatientService _service;


    public PatientsController(
        AppDbContext context,
        PatientService service
    )
    {
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


}