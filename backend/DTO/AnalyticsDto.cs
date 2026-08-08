namespace dentist_project.DTO
{
    public class AnalyticsDto
    {
        public List<ChartDto> Revenue { get; set; }
       = new();
        public List<ChartDto> Status { get; set; }
            = new();
        public List<ChartDto> Patients { get; set; }
            = new();
        public List<ChartDto> Treatments { get; set; }
            = new();

    }
}
