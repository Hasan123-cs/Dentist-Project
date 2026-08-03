namespace DentalClinic.Models;

public class RecallReminder
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public DateOnly LastVisitDate { get; set; }
    public DateOnly NextReminderDate { get; set; }
    // default every 6 months
    public int IntervalMonths { get; set; } = 6;
    public bool IsSent { get; set; }
}