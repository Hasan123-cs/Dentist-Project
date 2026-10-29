
namespace dentist_project.DTO
{
    public class UpdatePatientDto
    {
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Notes { get; set; }
    }
}
