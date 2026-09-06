using dentist_project.Data;
using dentist_project.Enums;
using dentist_project.DTO;
using Microsoft.EntityFrameworkCore;
using dentist_project.Models;

namespace dentist_project.Service
{
    public class DashboardService
    {
        private readonly AppDbContext _db;


        public DashboardService(AppDbContext context)
        {
            _db = context;
        }
        public async Task<DashboardDto> GetDashboardAsync(string role)
        {
            var today = DateTime.UtcNow.Date;

            var startWeek = today.AddDays(
                -(int)today.DayOfWeek
            );

            var endWeek = startWeek.AddDays(7);

            var dashboard = new DashboardDto();
            // today app 
            dashboard.TodaysAppointments =
            await _db.Appointments
            .CountAsync(x =>
                x.StartDateTime.Date == today
            );
            // confirmed 
            dashboard.ConfirmedAppointments =
           await _db.Appointments
           .CountAsync(x =>
               x.StartDateTime.Date == today
               &&
               x.Status == AppointmentStatus.Confirmed
           );
            // pending 
            dashboard.PendingAppointments =
            await _db.Appointments
            .CountAsync(x =>
                x.StartDateTime.Date == today
                &&
                x.Status == AppointmentStatus.Scheduled
            );
            dashboard.TotalPatients =await _db.Patients.CountAsync();
            var firstDayOfMonth = new DateTime(
             today.Year,
             today.Month,
             1,
             0,
             0,
             0,
             DateTimeKind.Utc
         );
            dashboard.NewPatientsMonth =await _db.Patients.CountAsync(x =>x.CreatedAt >= firstDayOfMonth);
            if (role == "Doctor")
            {
                dashboard.WeeklyRevenue =
                    await _db.Appointments
                    .Where(x =>
                        x.StartDateTime >= startWeek
                        &&
                        x.StartDateTime < endWeek
                    )
                    .SumAsync(x => x.AmountPaid);

                // outstanding balance
                dashboard.OutstandingBalance =
                await _db.Appointments
                .SumAsync(x =>
                    x.TotalCost - x.AmountPaid
                );

            }
            // schedule for both 
                   dashboard.Schedule =
           await _db.Appointments

           .Where(x =>
               x.StartDateTime.Date == today
           )

           .Include(x => x.Patient)

           .Include(x => x.AppointmentTreatments)
               .ThenInclude(x => x.Treatment)

           .OrderBy(x => x.StartDateTime)

           .Select(x => new ScheduleDto
           {

               Time =x.StartDateTime.ToString("HH:mm"),


               Name =x.Patient.FirstName+ " "+ x.Patient.LastName,


               Type =x.AppointmentTreatments.Select(t => t.Treatment.Name).FirstOrDefault()?? "General",


               Status =x.Status.ToString()

           })

           .ToListAsync();

            if (role == "Doctor")
            {
                dashboard.Analytics.Status =await GetAppointmentStatusChart();



                dashboard.Analytics.Patients =await GetPatientGrowthChart();



                dashboard.Analytics.Treatments =await GetPopularTreatmentsChart();
                dashboard.Analytics.Revenue =await GetRevenueChart();
            }
            return dashboard;

        }
        private async Task<List<ChartDto>> GetPatientGrowthChart()
        {
            var data = await _db.Patients
                .GroupBy(x => new
                {
                    x.CreatedAt.Year,
                    x.CreatedAt.Month
                })
                .Select(x => new
                {
                    Month = x.Key.Month,
                    Count = x.Count()
                })
                .ToListAsync();


            return data.Select(x => new ChartDto
            {
                Name = x.Month.ToString(),
                Value = x.Count
            }).ToList();
        }
        private async Task<List<ChartDto>> GetRevenueChart()
        {
            var data = await _db.Appointments
                .GroupBy(x => new
                {
                    x.StartDateTime.Year,
                    x.StartDateTime.Month,
                    x.StartDateTime.Day
                })
                .Select(x => new
                {
                    Year = x.Key.Year,
                    Month = x.Key.Month,
                    Day = x.Key.Day,
                    Amount = x.Sum(a => a.AmountPaid)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ThenBy(x => x.Day)
                .ToListAsync();


            return data.Select(x => new ChartDto
            {
                Name = $"{x.Month}/{x.Day}",
                Value = x.Amount
            })
            .ToList();
        }
        private async Task<List<ChartDto>> GetAppointmentStatusChart()
        {
            return await _db.Appointments
                .GroupBy(x => x.Status)
                .Select(x => new ChartDto
                {

                    Name =x.Key.ToString(),


                    Value =x.Count()

                })
                .ToListAsync();

        }
        private async Task<List<ChartDto>> GetPopularTreatmentsChart()
        {
            return await _db.AppointmentTreatments
                .Include(x => x.Treatment)
                .GroupBy(x =>
                    x.Treatment.Name
                )
                .Select(x => new ChartDto
                {
                    Name = x.Key,
                    Value = x.Count()
                })
                .OrderByDescending(x => x.Value)
                .Take(5)
                .ToListAsync();
        }
        // seeding the teeth for no not found error only 
        public  async Task SeedTeethAsync()
        {
            var teeth = new List<Tooth>
        {
            new() { Number = 11, Name = "Upper Right Central Incisor" },
            new() { Number = 12, Name = "Upper Right Lateral Incisor" },
            new() { Number = 13, Name = "Upper Right Canine" },
            new() { Number = 14, Name = "Upper Right First Premolar" },
            new() { Number = 15, Name = "Upper Right Second Premolar" },
            new() { Number = 16, Name = "Upper Right First Molar" },
            new() { Number = 17, Name = "Upper Right Second Molar" },
            new() { Number = 18, Name = "Upper Right Third Molar" },

            new() { Number = 21, Name = "Upper Left Central Incisor" },
            new() { Number = 22, Name = "Upper Left Lateral Incisor" },
            new() { Number = 23, Name = "Upper Left Canine" },
            new() { Number = 24, Name = "Upper Left First Premolar" },
            new() { Number = 25, Name = "Upper Left Second Premolar" },
            new() { Number = 26, Name = "Upper Left First Molar" },
            new() { Number = 27, Name = "Upper Left Second Molar" },
            new() { Number = 28, Name = "Upper Left Third Molar" },

            new() { Number = 31, Name = "Lower Left Central Incisor" },
            new() { Number = 32, Name = "Lower Left Lateral Incisor" },
            new() { Number = 33, Name = "Lower Left Canine" },
            new() { Number = 34, Name = "Lower Left First Premolar" },
            new() { Number = 35, Name = "Lower Left Second Premolar" },
            new() { Number = 36, Name = "Lower Left First Molar" },
            new() { Number = 37, Name = "Lower Left Second Molar" },
            new() { Number = 38, Name = "Lower Left Third Molar" },

            new() { Number = 41, Name = "Lower Right Central Incisor" },
            new() { Number = 42, Name = "Lower Right Lateral Incisor" },
            new() { Number = 43, Name = "Lower Right Canine" },
            new() { Number = 44, Name = "Lower Right First Premolar" },
            new() { Number = 45, Name = "Lower Right Second Premolar" },
            new() { Number = 46, Name = "Lower Right First Molar" },
            new() { Number = 47, Name = "Lower Right Second Molar" },
            new() { Number = 48, Name = "Lower Right Third Molar" }
        };

            foreach (var tooth in teeth)
            {
                var exists = await _db.Teeth
                    .AnyAsync(t => t.Number == tooth.Number);

                if (!exists)
                {
                    _db.Teeth.Add(tooth);
                }
            }

            await _db.SaveChangesAsync();
        }
        // === seeding the teeth for no not found error only ===

    }
}
