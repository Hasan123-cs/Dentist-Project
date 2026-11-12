namespace dentist_project.DTO;

public class UpdateAppointmentDto
{
    public string PatientName { get; set; } = null!;
    public string? PatientPhone { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string? Notes { get; set; }
}
