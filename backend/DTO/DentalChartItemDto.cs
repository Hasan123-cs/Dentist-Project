using dentist_project.Enums;
using dentist_project.Models.Enums;

namespace dentist_project.DTO
{
    public class DentalChartItemDto
    {
        public int ToothNumber { get; set; }


        // Example:
        // {
        //    "M": Filling,
        //    "D": Cavity
        // }
        public Dictionary<string, ToothCondition> Surfaces { get; set; } = new();


        // Example:
        // RootCanal
        // Crown
        // Implant
        public List<ToothCondition> Conditions { get; set; } = new();


        public ToothStatus Status { get; set; }


        public int? TreatmentId { get; set; }


        public string? Notes { get; set; }
    }
}