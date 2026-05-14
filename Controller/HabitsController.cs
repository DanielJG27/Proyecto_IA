using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using StudyAI.Models;

namespace StudyAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HabitsController : ControllerBase
    {
        private readonly StudyDbContext _context;

        public HabitsController(StudyDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(userIdStr ?? "0");
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var userId = GetUserId();
            var now = DateTime.UtcNow;

            var allHabits = await _context.StudyHabits
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.StudyDate)
                .ToListAsync();

            // Calculate total time
            var totalTimeMinutes = allHabits.Sum(h => h.DurationMinutes);

            // Calculate current streak
            int currentStreak = 0;
            var today = now.Date;
            var datesStudied = allHabits.Select(h => h.StudyDate.Date).Distinct().ToList();

            if (datesStudied.Contains(today))
            {
                currentStreak = 1;
                var checkDate = today.AddDays(-1);
                while (datesStudied.Contains(checkDate))
                {
                    currentStreak++;
                    checkDate = checkDate.AddDays(-1);
                }
            }

            // Get recent habits
            var recentHabits = allHabits.Take(7).ToList();

            // Get time per subject
            var timePerSubject = allHabits
                .GroupBy(h => h.Subject)
                .Select(g => new { Subject = g.Key, TotalMinutes = g.Sum(h => h.DurationMinutes) })
                .ToList();

            return Ok(new
            {
                totalTimeMinutes,
                currentStreak,
                recentHabits,
                timePerSubject
            });
        }

        [HttpPost("log")]
        public async Task<IActionResult> LogStudyTime([FromBody] StudyHabitRequest request)
        {
            var userId = GetUserId();

            var habit = new StudyHabit
            {
                UserId = userId,
                Subject = request.Subject,
                DurationMinutes = request.DurationMinutes,
                StudyDate = DateTime.UtcNow
            };

            _context.StudyHabits.Add(habit);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Study time logged successfully" });
        }
    }

    public class StudyHabitRequest
    {
        public string Subject { get; set; } = string.Empty;
        public int DurationMinutes { get; set; }
    }
}
