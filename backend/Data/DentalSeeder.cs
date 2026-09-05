using dentist_project.Enums;
using dentist_project.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace dentist_project.Data;


public static class DentalSeeder
{

    public static async Task SeedAsync(
        AppDbContext db,
        UserManager<ApplicationUser> userManager)
    {


        Console.WriteLine("=== DENTAL SEED START ===");



        // Get Doctor
        var doctor =
            await userManager.FindByEmailAsync(
                "Doctor-Amany@clinic.com"
            );


        if (doctor == null)
        {
            Console.WriteLine("Doctor not found");
            return;
        }


        Console.WriteLine(
            "Doctor found: " + doctor.Email
        );





        // ==========================
        // Treatments
        // ==========================

        if (!await db.Treatments.AnyAsync())
        {

            await db.Treatments.AddRangeAsync(

                new Treatment
                {
                    Name = "Root Canal",
                    DefaultPrice = 450,
                    EstimatedMinutes = 90,
                    IsActive = true
                },


                new Treatment
                {
                    Name = "Dental Crown",
                    DefaultPrice = 800,
                    EstimatedMinutes = 60,
                    IsActive = true
                },


                new Treatment
                {
                    Name = "Filling",
                    DefaultPrice = 150,
                    EstimatedMinutes = 30,
                    IsActive = true
                }

            );


            await db.SaveChangesAsync();


            Console.WriteLine("Treatments created");

        }







        // ==========================
        // Appointment Treatments
        // ==========================
        var tooth36 =
    await db.Teeth
    .FirstAsync(t => t.Number == 36);


        var tooth14 =
            await db.Teeth
            .FirstAsync(t => t.Number == 14);


        if (!await db.AppointmentTreatments.AnyAsync())
        {


            var patientCount =
                await db.Patients.CountAsync();


            Console.WriteLine(
                "Patients count: " + patientCount
            );



            if (patientCount < 2)
            {
                Console.WriteLine(
                    "Not enough patients"
                );

                return;
            }




            var john =
                await db.Patients
                .FirstAsync();



            var sarah =
                await db.Patients
                .Skip(1)
                .FirstAsync();






            var root =
                await db.Treatments
                .FirstAsync(
                    x => x.Name == "Root Canal"
                );



            var crown =
                await db.Treatments
                .FirstAsync(
                    x => x.Name == "Dental Crown"
                );






            var appointment1 = new Appointment
            {

                PatientId = john.Id,


                CreatedById = doctor.Id,


                StartDateTime =
                    DateTime.UtcNow.AddDays(-5),


                EndDateTime =
                    DateTime.UtcNow
                    .AddDays(-5)
                    .AddMinutes(90),



                Status =
                    AppointmentStatus.Completed,


                TotalCost = 450,


                AmountPaid = 450

            };




            appointment1.AppointmentTreatments.Add(

               new AppointmentTreatment
               {
                   TreatmentId = root.Id,
                   ToothId = tooth36.Id,
                   Price = 450,
                   Notes = "Completed successfully"
               }

            );







            var appointment2 = new Appointment
            {

                PatientId = sarah.Id,


                CreatedById = doctor.Id,


                StartDateTime =
                    DateTime.UtcNow.AddDays(2),



                EndDateTime =
                    DateTime.UtcNow
                    .AddDays(2)
                    .AddMinutes(60),



                Status =
                    AppointmentStatus.Scheduled,



                TotalCost = 800,


                AmountPaid = 0

            };






            appointment2.AppointmentTreatments.Add(

              new AppointmentTreatment
              {
                  TreatmentId = crown.Id,
                  ToothId = tooth14.Id,
                  Price = 800,
                  Notes = "Temporary crown placed"
              }

            );






            await db.Appointments.AddRangeAsync(
                appointment1,
                appointment2
            );



            await db.SaveChangesAsync();


            Console.WriteLine(
                "Appointments created"
            );

        }





        Console.WriteLine(
            "Treatments: " +
            await db.Treatments.CountAsync()
        );


        Console.WriteLine(
            "Appointments: " +
            await db.Appointments.CountAsync()
        );


        Console.WriteLine(
            "AppointmentTreatments: " +
            await db.AppointmentTreatments.CountAsync()
        );



        Console.WriteLine(
            "=== DENTAL SEED END ==="
        );


    }

}