public class CreateAppointmentDto
{
    public string PatientName { get; set; } = null!;

    public string TreatmentName { get; set; } = null!;


    public List<int>? ToothNumbers { get; set; }


    public DateOnly Date { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }
}