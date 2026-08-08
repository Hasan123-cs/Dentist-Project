namespace dentist_project.Models;

public class MedicalRecord
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public int AppointmentId { get; set; }
    public Appointment Appointment { get; set; } = null!;
    public string? Diagnosis { get; set; }
    public string? TreatmentPlan { get; set; }
    // Doctor/Assistant who created the record
    public string CreatedById { get; set; } = null!;
    public string? Prescription { get; set; }
    public string? ClinicalNotes { get; set; }

    public ApplicationUser CreatedBy { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;
    public ICollection<ToothTreatment> ToothTreatments { get; set; }
        = new List<ToothTreatment>();
}