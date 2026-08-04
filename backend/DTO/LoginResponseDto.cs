namespace dentist_project.DTO
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = null!;
        public DateTime Expiration { get; set; }
        public string UserId { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public IList<string> Roles { get; set; } = new List<string>();
    }
}
