namespace dentist_project.DTO;

public class CreatePatientDto
{
    public string FullName { get; set; } = null!;


    public string? Phone { get; set; }


    public string? Gender { get; set; }


    public DateOnly? DateOfBirth { get; set; }


    public string? Allergies { get; set; }


    public string? MedicalHistory { get; set; }
}