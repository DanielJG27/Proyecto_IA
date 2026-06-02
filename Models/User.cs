using System;
using System.Collections.Generic;

namespace StudyAI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Hábitos de estudio iniciales
        public double StudyHours { get; set; }
        public int DaysPerWeek { get; set; }
        public string ConcentrationLevel { get; set; } = string.Empty;
        public string OtherVariables { get; set; } = string.Empty;

        // Navigation properties
        public ICollection<StudyHabit> StudyHabits { get; set; } = new List<StudyHabit>();
        public ICollection<ChatHistory> ChatHistories { get; set; } = new List<ChatHistory>();
    }
}
