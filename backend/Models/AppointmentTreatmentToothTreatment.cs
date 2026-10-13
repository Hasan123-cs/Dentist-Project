namespace dentist_project.Models;

public class AppointmentTreatmentToothTreatment
{
    public int Id { get; set; }


    public int AppointmentTreatmentId { get; set; }

    public AppointmentTreatment AppointmentTreatment { get; set; } = null!;



    public int ToothTreatmentId { get; set; }

    public ToothTreatment ToothTreatment { get; set; } = null!;
}