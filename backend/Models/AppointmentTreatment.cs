namespace DentalClinic.Models;

public class AppointmentTreatment
{
    public int Id { get; set; }
    public int AppointmentId { get; set; }
    public Appointment Appointment { get; set; } = null!;
    public int TreatmentId { get; set; }
    public Treatment Treatment { get; set; } = null!;
    public decimal Price { get; set; }
    public string? Notes { get; set; }
}