using dentist_project.Enums;

namespace dentist_project.Models;

public class AppointmentTreatment
{
    public int Id { get; set; }


    public int AppointmentId { get; set; }
    public Appointment Appointment { get; set; } = null!;



    public int TreatmentId { get; set; }
    public Treatment Treatment { get; set; } = null!;



    public decimal Price { get; set; }


    // payment for this specific treatment
    public decimal PaidAmount { get; set; } = 0;



    // Planned -> InProgress -> Completed
    public TreatmentStatus Status { get; set; }
        = TreatmentStatus.Planned;



    public DateTime? CompletedAt { get; set; }



    public string? Notes { get; set; }



    public ICollection<ToothTreatment> ToothTreatments { get; set; }
        = new List<ToothTreatment>();

}