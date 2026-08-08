using dentist_project.Data;
using dentist_project.Enums;
using dentist_project.DTO;
using Microsoft.EntityFrameworkCore;

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
    }
}
