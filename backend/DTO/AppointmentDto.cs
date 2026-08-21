namespace dentist_project.DTO
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        // For React Calendar
        public string AppointmentDate { get; set; } = null!;
        public string StartTime { get; set; } = null!;
        public string EndTime { get; set; } = null!;
        public string Status { get; set; } = null!;
        public decimal TotalCost { get; set; }
        public string? Notes { get; set; }
        // static
        public int TotalToday { get; set; } = 18;
        public int Completed { get; set; } = 8;
        public int InProgress { get; set; } = 3;
        public int Scheduled { get; set; } = 18;
    }
}
    