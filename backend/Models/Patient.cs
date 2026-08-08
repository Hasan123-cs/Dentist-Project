namespace dentist_project.Models;

public class Patient
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public DateOnly? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string Phone { get; set; } = null!;
    public string? Allergies { get; set; }
    public string? MedicalHistory { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
    public ICollection<RecallReminder> RecallReminders { get; set; } = new List<RecallReminder>();
    public ICollection<Notification> Notifications { get; set; }= new List<Notification>();
}