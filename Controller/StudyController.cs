using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using StudyAI.Models;

namespace StudyAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudyController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public StudyController()
        {
              _httpClient = new HttpClient();
        //    _httpClient.DefaultRequestHeaders.Authorization =
          //      new AuthenticationHeaderValue("Bearer", "sA");
        }

        [HttpPost("resumen")]
            public async Task<IActionResult> Resumen([FromBody] TextoRequest data)
            {
                if (data == null || string.IsNullOrEmpty(data.texto))
                {
                    return BadRequest("El texto es requerido");
                }

                string texto = data.texto;


                string prompt = "";

                    switch (data.modo)
                    {
                        case "resumen":
                            prompt = $"Resume el siguiente texto:\n{texto}";
                            break;

                        case "preguntas":
                            prompt = $"Genera 5 preguntas sobre este texto:\n{texto}";
                            break;

                        case "explicar":
                            prompt = $"Explica este texto de forma sencilla como si fuera para un niño:\n{texto}";
                            break;

                        case "quiz":
                            prompt = $"Crea un quiz de 3 preguntas con respuestas basadas en este texto:\n{texto}";
                            break;

                        default:
                            prompt = texto;
                            break;
                    }

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

                var apiKey = "AQ.Ab8RN6IukvY_C2dG8CS-jqqvU0fl8wkJ1xZGvujPD-7JSD4B9Q";

                var response = await _httpClient.PostAsync(
                        $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}",
                            content
                );

                var result = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    
                    return StatusCode((int)response.StatusCode, result);
                }

                try
                {
                    var json = JsonDocument.Parse(result);

                        var respuestaIA = json                        
                        .RootElement
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();

                    var resultadoIA = JsonDocument.Parse(texto);

                    var resumen = resultadoIA.RootElement.GetProperty("resumen").GetString();

                    var preguntas = resultadoIA.RootElement
                        .GetProperty("preguntas")
                        .EnumerateArray()
                        .Select(p => p.GetString())
                        .ToList();

                    return Ok(new
                    {
                        resumen = resumen,
                        preguntas = preguntas
                    });
                }
                catch
                {
                    return StatusCode(500, "Error procesando la respuesta de la IA");
                }
            }

        [HttpPost("chat")]
            public async Task<IActionResult> Chat([FromBody] ChatRequest data)
            {
                if (data == null || string.IsNullOrEmpty(data.mensaje))
                {
                    return BadRequest("El mensaje es requerido");
                }

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

                var apiKey = "AQ.Ab8RN6IukvY_C2dG8CS-jqqvU0fl8wkJ1xZGvujPD-7JSD4B9Q";
                

               var response = await _httpClient.PostAsync(
                   $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}",
                        content

                );

                var result = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, result);
                }

                return Ok(result);
            }
    }
}