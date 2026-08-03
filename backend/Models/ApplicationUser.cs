using Microsoft.AspNetCore.Identity;

namespace DentalClinic.Models;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;


    // Doctor / Assistant
    public string Role { get; set; } = null!;


    public bool IsActive { get; set; } = true;


    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



    // Appointments created by this employee
    public ICollection<Appointment> AppointmentsCreated { get; set; }
        = new List<Appointment>();


    // Medical records created by this employee
    public ICollection<MedicalRecord> MedicalRecordsCreated { get; set; }
        = new List<MedicalRecord>();
}