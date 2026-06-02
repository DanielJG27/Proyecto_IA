using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Linq;
using System.Security.Claims;
using StudyAI.Models;

namespace StudyAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Added authorization!
    public class StudyController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly StudyDbContext _context;

        public StudyController(IConfiguration configuration, StudyDbContext context)
        {
            _httpClient = new HttpClient();
            _apiKey = configuration["GeminiApiKey"] ?? "";
            _context = context;
        }

        private int GetUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.Parse(userIdStr ?? "0");
        }

        [HttpPost("resumen")]
        public async Task<IActionResult> Resumen([FromBody] TextoRequest data)
        {
            if (data == null || string.IsNullOrEmpty(data.texto))
            {
                return BadRequest("El texto es requerido");
            }

            var userId = GetUserId();

            // 1. Construcción del Prompt según el modo
            string prompt = data.modo switch
            {
                "resumen"   => $"Resume el siguiente texto:\n{data.texto}",
                "preguntas" => $"Genera 5 preguntas de estudio sobre este texto:\n{data.texto}",
                "explicar"  => $"Explica este texto de forma sencilla como si fuera para un niño:\n{data.texto}",
                "quiz"      => $"Crea un quiz de 3 preguntas con opciones basado en este texto:\n{data.texto}",
                "flashcards" => $"Genera un conjunto de flashcards (mínimo 5) para estudiar el siguiente texto. Usa estrictamente el formato:\nPregunta 1: [Pregunta]\nRespuesta 1: [Respuesta]\nPregunta 2: [Pregunta]\nRespuesta 2: [Respuesta]\ny así sucesivamente. Texto:\n{data.texto}",
                _           => data.texto
            };

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";
            var response = await _httpClient.PostAsync(url, content);
            var result = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine(result);
                return StatusCode((int)response.StatusCode, result);
            }

            try
            {
                using var json = JsonDocument.Parse(result);
                
                var respuestaTextoIA = json.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString() ?? "";

                // SAVE TO HISTORY
                var chatHistory = new ChatHistory
                {
                    UserId = userId,
                    Mode = data.modo,
                    Prompt = data.texto, // original input text
                    Response = respuestaTextoIA
                };
                _context.ChatHistories.Add(chatHistory);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    exito = true,
                    data = respuestaTextoIA,
                    modoProcesado = data.modo
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al procesar la respuesta de la IA", detalle = ex.Message });
            }
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest data)
        {
            if (data == null || string.IsNullOrEmpty(data.mensaje))
            {
                return BadRequest("El mensaje es requerido");
            }

            var userId = GetUserId();

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = data.mensaje }
                        }
                    }
                }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";
            var response = await _httpClient.PostAsync(url, content);
            var result = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine(result);
                return StatusCode((int)response.StatusCode, result);
            }

            try
            {
                using var json = JsonDocument.Parse(result);
                var respuestaTextoIA = json.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString() ?? "";

                var chatHistory = new ChatHistory
                {
                    UserId = userId,
                    Mode = "chat",
                    Prompt = data.mensaje,
                    Response = respuestaTextoIA
                };
                _context.ChatHistories.Add(chatHistory);
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                // Non fatal error for history saving
                Console.WriteLine("Error saving history: " + e.Message);
            }

            return Ok(result);
        }

        [HttpGet("analysis")]
        public async Task<IActionResult> GetAIAnalysis()
        {
            var userId = GetUserId();
            var habits = _context.StudyHabits.Where(h => h.UserId == userId).OrderByDescending(h => h.StudyDate).Take(10).ToList();
            var history = _context.ChatHistories.Where(h => h.UserId == userId).OrderByDescending(h => h.CreatedAt).Take(5).ToList();

            if (!habits.Any()) {
                return Ok(new { analysis = "Aún no tienes suficientes datos de estudio. ¡Registra tus primeras sesiones para que la IA pueda analizar tus hábitos y darte consejos personalizados!" });
            }

            string habitsContext = string.Join(", ", habits.Select(h => $"{h.DurationMinutes}min de {h.Subject}"));
            string prompt = $"Eres un asistente de estudio. Analiza brevemente (max 3 oraciones) estos hábitos recientes del estudiante y dale un consejo motivador y personalizado: {habitsContext}";

            var requestBody = new
            {
                contents = new[] { new { parts = new[] { new { text = prompt } } } }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";
            
            var response = await _httpClient.PostAsync(url, content);
            var result = await response.Content.ReadAsStringAsync();

            try {
                using var json = JsonDocument.Parse(result);
                var analysisText = json.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
                return Ok(new { analysis = analysisText });
            } catch {
                return Ok(new { analysis = "Sigue estudiando, ¡lo estás haciendo genial! Vuelve más tarde para un análisis detallado." });
            }
        }
    }
}