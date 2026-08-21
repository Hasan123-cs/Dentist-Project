namespace dentist_project.DTO
{
    public class AppointmentResponseDto
    {
        public int TotalToday { get; set; }
        public int Completed { get; set; }
        public int InProgress { get; set; }
        public int Scheduled { get; set; }
        public List<AppointmentDto> Appointments { get; set; } = new();
    }
}
