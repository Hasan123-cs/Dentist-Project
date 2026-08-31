using dentist_project.Enums;

namespace dentist_project.DTO;

public class CreateAppointmentDto
{
    public string PatientName { get; set; } = null!;
    public string TreatmentName { get; set; } = null!;

    public DateOnly Date { get; set; }
    public TimeOnly Time { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
}