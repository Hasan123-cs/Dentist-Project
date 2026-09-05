using dentist_project.Data;
using dentist_project.DTO;
using Microsoft.EntityFrameworkCore;

namespace dentist_project.Service
{
    public class TreatmentService
    {
        private readonly AppDbContext _context;


        public TreatmentService(AppDbContext context)
        {
            _context = context;
        }





        public async Task<List<TreatmentListDto>> GetAllTreatments()
        {


            return await _context.AppointmentTreatments

            .Select(x => new TreatmentListDto
            {


                Id = x.Id,


                PatientId = x.Appointment.PatientId,


                Patient =
                x.Appointment.Patient.FirstName
                + " "
                + x.Appointment.Patient.LastName,



                Treatment =
                x.Treatment.Name,



                Tooth = x.Tooth != null
    ? x.Tooth.Number.ToString()
    : "",



                Status =
                x.Appointment.Status.ToString(),



                Price =
                x.Price,



                Duration =
                x.Treatment.EstimatedMinutes
                + " min",



                Date =
                x.Appointment.StartDateTime,



                Notes =
                x.Notes


            })

            .ToListAsync();


        }
    }
}
