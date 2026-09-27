using dentist_project.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dentist_project.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;


        public NotificationController(AppDbContext context)
        {
            _context = context;
        }



        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var notifications = await _context.Notifications
                .Include(n => n.Patient)
                .OrderByDescending(n => n.SentAt)
                .Select(n => new
                {
                    id = n.Id,

                    patientName =
                        n.Patient.FirstName + " "
                        + n.Patient.LastName,

                    phone = n.Patient.Phone,

                    message = n.Message,

                    sentAt = n.SentAt,

                    isSent = n.IsSent
                })
                .ToListAsync();


            return Ok(notifications);
        }
    }
}