namespace StudyAI.Models
{
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public double StudyHours { get; set; }
        public int DaysPerWeek { get; set; }
        public string ConcentrationLevel { get; set; } = string.Empty;
        public string OtherVariables { get; set; } = string.Empty;
    }
}
