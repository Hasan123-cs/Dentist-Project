using dentist_project.Enums;

namespace dentist_project.DTO;

public class CreateAppointmentDto
{
    public string PatientName { get; set; } = null!;

    public string TreatmentName { get; set; } = null!;

    public DateOnly Date { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }
}
