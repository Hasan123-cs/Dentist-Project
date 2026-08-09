namespace dentist_project.DTO
{
    public class DashboardDto
    {
        public string userName { get; set; } =string.Empty;
        public int TodaysAppointments { get; set; }

        public int ConfirmedAppointments { get; set; }

        public int PendingAppointments { get; set; }

        public decimal? WeeklyRevenue { get; set; }

        public decimal? OutstandingBalance { get; set; }

        public int TotalPatients { get; set; }

        public int NewPatientsMonth { get; set; }


        public List<ScheduleDto> Schedule { get; set; }
            = new();

        public AnalyticsDto Analytics { get; set; }
            = new();
    }
}
