using System;

namespace StudyAI.Models
{
    public class ChatHistory
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Mode { get; set; } = string.Empty; // resumen, quiz, etc.
        public string Prompt { get; set; } = string.Empty;
        public string Response { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
    }
}
