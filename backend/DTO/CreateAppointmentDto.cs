public class CreateAppointmentDto
{
    public string PatientName { get; set; } = null!;
    public string? PatientPhone { get; set; }

    public string AppointmentType { get; set; } = "Treatment";

    public string? TreatmentName { get; set; }


    public List<int>? ToothNumbers { get; set; }


    public DateOnly Date { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }
}