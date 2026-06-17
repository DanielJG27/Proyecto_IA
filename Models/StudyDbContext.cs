using Microsoft.EntityFrameworkCore;

namespace StudyAI.Models
{
    public class StudyDbContext : DbContext
    {
        public StudyDbContext(DbContextOptions<StudyDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<StudyHabit> StudyHabits { get; set; } = null!;
        public DbSet<ChatHistory> ChatHistories { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
                
            base.OnModelCreating(modelBuilder);
        }
    }
}
