namespace dentist_project.DTO
{
    public class TreatmentListDto
    {
        public int Id { get; set; }


        public int PatientId { get; set; }


        public string Patient { get; set; } = "";


        public string Treatment { get; set; } = "";


        public string Tooth { get; set; } = "";


        public string Status { get; set; } = "";


        public decimal Price { get; set; }


        public string Duration { get; set; } = "";


        public DateTime Date { get; set; }


        public string? Notes { get; set; }
    }
}
