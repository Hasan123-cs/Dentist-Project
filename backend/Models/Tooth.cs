namespace dentist_project.Models;

public class Tooth
{
    public int Id { get; set; }
    // Example: 11,12,36,48
    public int Number { get; set; }
    public string Name { get; set; } = null!;
    public ICollection<ToothTreatment> ToothTreatments { get; set; }= new List<ToothTreatment>();
}