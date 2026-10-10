using dentist_project.Enums;

namespace dentist_project.Models;

public class Notification
{

    public int Id { get; set; }


    public int PatientId { get; set; }

    public Patient Patient { get; set; } = null!;



    public int? AppointmentId { get; set; }

    public Appointment? Appointment { get; set; }



    public NotificationType Type { get; set; }



    public string Message { get; set; } = null!;



    public DateTime? ReminderDate { get; set; }



    public bool IsApproved { get; set; } = false;



    public string? ApprovedById { get; set; }

    public ApplicationUser? ApprovedBy { get; set; }



    public DateTime? ApprovedAt { get; set; }



    public bool IsSent { get; set; }

    public DateTime? SentAt { get; set; }

    public string? ErrorMessage { get; set; }

}