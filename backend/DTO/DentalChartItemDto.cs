using dentist_project.Enums;
using dentist_project.Models.Enums;

namespace dentist_project.DTO
{
    public class DentalChartItemDto
    {
        public int ToothNumber { get; set; }

        public ToothSurface? Surface { get; set; }

        public ToothCondition Condition { get; set; }

        public ToothStatus Status { get; set; }

        public int? TreatmentId { get; set; }

        public string? Notes { get; set; }
    }
}
