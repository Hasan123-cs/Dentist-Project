namespace dentist_project.DTO
{
    public class CreateTreatmentDto
    {

        public string Treatment { get; set; } = null!;

        public List<int> ToothNumbers { get; set; } = new();

        public string? Surface { get; set; }

        public string Status { get; set; } = "Pending";

        public decimal? Price { get; set; }

        public string? Notes { get; set; }
    }
}
