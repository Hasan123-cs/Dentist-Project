namespace dentist_project.DTOs;

public class PatientDto
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateOnly? DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public string Phone { get; set; } = null!;

    public string? Allergies { get; set; }

    public string? MedicalHistory { get; set; }

    public DateTime CreatedAt { get; set; }
}