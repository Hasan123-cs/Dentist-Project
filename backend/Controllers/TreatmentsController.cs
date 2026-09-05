using dentist_project.Service;
using Microsoft.AspNetCore.Mvc;

namespace dentist_project.Controllers;


[ApiController]
[Route("api/[controller]")]
public class TreatmentsController : ControllerBase
{


    private readonly TreatmentService _service;



    public TreatmentsController(TreatmentService service)
    {
        _service = service;
    }





    [HttpGet("all")]

    public async Task<IActionResult> GetAll()
    {


        var result =
            await _service.GetAllTreatments();


        return Ok(result);


    }


}