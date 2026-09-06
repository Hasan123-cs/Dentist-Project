namespace dentist_project.DTO
{
    public class UpdateToothStatusDto
    {
        
            public int PatientId { get; set; }

            public int ToothNumber { get; set; }

            public string? Surface { get; set; }

            public string Condition { get; set; } = null!;

            public string Status { get; set; } = "NeedsTreatment";

            public int? TreatmentId { get; set; }

            public string? Notes { get; set; }
        }
}
