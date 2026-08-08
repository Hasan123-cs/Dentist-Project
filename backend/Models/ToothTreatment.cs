using dentist_project.Enums;

namespace dentist_project.Models;

public class ToothTreatment
{
    public int Id { get; set; }
    public int MedicalRecordId { get; set; }

    public MedicalRecord MedicalRecord { get; set; } = null!;
    public int ToothId { get; set; }
    public Tooth Tooth { get; set; } = null!;
    public int TreatmentId { get; set; }
    public Treatment Treatment { get; set; } = null!;
    public ToothStatus Status { get; set; }
    public string? Notes { get; set; }
}