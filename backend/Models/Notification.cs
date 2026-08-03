using DentalClinic.Enums;

namespace DentalClinic.Models;

public class Notification
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;

    public int? AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }
    public NotificationType Type { get; set; }
    public string Message { get; set; } = null!;
    public bool IsSent { get; set; }
    public DateTime? SentAt { get; set; }
}