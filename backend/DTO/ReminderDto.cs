namespace dentist_project.DTO
{
    public class ReminderDto
    {
        public int Id { get; set; }

        public string PatientName { get; set; } = null!;
        public string Phone { get; set; }

        public string Message { get; set; } = null!;

        public string Type { get; set; } = null!;  
        public string Date { get; set; } = "";

        public string Time { get; set; } = "";
    }
}
