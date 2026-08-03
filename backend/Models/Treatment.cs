namespace DentalClinic.Models;

public class Treatment
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal DefaultPrice { get; set; }
    public int EstimatedMinutes { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<ToothTreatment> ToothTreatments { get; set; }= new List<ToothTreatment>();
    public ICollection<AppointmentTreatment> AppointmentTreatments { get; set; } = new List<AppointmentTreatment>();
}