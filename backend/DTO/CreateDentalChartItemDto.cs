using dentist_project.Enums;
using dentist_project.Models.Enums;

namespace dentist_project.DTO
{
    public class CreateDentalChartItemDto
    {
        public int MedicalRecordId { get; set; }

        public int ToothNumber { get; set; }

        public ToothSurface? Surface { get; set; }

        public ToothCondition Condition { get; set; }

        public ToothStatus Status { get; set; } = ToothStatus.NeedsTreatment;

        public int? TreatmentId { get; set; }

        public string? Notes { get; set; }
    }
}
