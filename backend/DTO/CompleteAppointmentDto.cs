namespace dentist_project.DTO
{
    public class CompleteAppointmentDto
    {
        public string PaymentStatus { get; set; } = "Unpaid";
        public decimal PaidAmount { get; set; }
    }
}
