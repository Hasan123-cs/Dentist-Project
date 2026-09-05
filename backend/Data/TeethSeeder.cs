using dentist_project.Models;
using Microsoft.EntityFrameworkCore;

namespace dentist_project.Data;


public static class TeethSeeder
{

    public static async Task SeedAsync(AppDbContext db)
    {

        if (await db.Teeth.AnyAsync())
            return;


        var teeth = new List<Tooth>();


        // Upper Right 11-18
        for (int i = 11; i <= 18; i++)
        {
            teeth.Add(new Tooth
            {
                Number = i,
                Name = $"Tooth {i}"
            });
        }



        // Upper Left 21-28
        for (int i = 21; i <= 28; i++)
        {
            teeth.Add(new Tooth
            {
                Number = i,
                Name = $"Tooth {i}"
            });
        }



        // Lower Left 31-38
        for (int i = 31; i <= 38; i++)
        {
            teeth.Add(new Tooth
            {
                Number = i,
                Name = $"Tooth {i}"
            });
        }



        // Lower Right 41-48
        for (int i = 41; i <= 48; i++)
        {
            teeth.Add(new Tooth
            {
                Number = i,
                Name = $"Tooth {i}"
            });
        }



        await db.Teeth.AddRangeAsync(teeth);

        await db.SaveChangesAsync();


        Console.WriteLine("Teeth seeded");


    }

}