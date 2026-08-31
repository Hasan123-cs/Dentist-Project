using dentist_project.DTO;
using dentist_project.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dentist_project.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DentalChartController : ControllerBase
    {
        private readonly PatientService _dentalChartService;

        public DentalChartController(PatientService dentalChartService)
        {
            _dentalChartService = dentalChartService;
        }

        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<List<DentalChartItemDto>>> GetPatientDentalChart(
            int patientId)
        {
            var chart = await _dentalChartService
                .GetPatientDentalChartAsync(patientId);

            return Ok(chart);
        }
    }
}