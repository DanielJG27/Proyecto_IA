using System;

namespace StudyAI.Models
{
    public class StudyHabit
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public int DurationMinutes { get; set; }
        public DateTime StudyDate { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
    }
}
