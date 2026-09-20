namespace dentist_project.DTO
{
    public class CreatePatientDto
    {
        public string Name { get; set; } = null!;

        public string PatientCode { get; set; } = null!;

        public string Phone { get; set; } = null!;

        public string? Gender { get; set; }

        public DateOnly? BirthDate { get; set; }

        public string? Notes { get; set; }
    }
}
