using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Linq;
using StudyAI.Models;

namespace StudyAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudyController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        // Tip: En producción, usa IHttpClientFactory en lugar de instanciar HttpClient manualmente
        private const string ApiKey = "AIzaSyBM7pqdHhW-MK1N_Uv0KiU7glV3Uke2m3E";

        public StudyController()
        {
            _httpClient = new HttpClient();
        }

        [HttpPost("resumen")]
        public async Task<IActionResult> Resumen([FromBody] TextoRequest data)
        {
            if (data == null || string.IsNullOrEmpty(data.texto))
            {
                return BadRequest("El texto es requerido");
            }

            // 1. Construcción del Prompt según el modo
            string prompt = data.modo switch
            {
                "resumen"   => $"Resume el siguiente texto:\n{data.texto}",
                "preguntas" => $"Genera 5 preguntas de estudio sobre este texto:\n{data.texto}",
                "explicar"  => $"Explica este texto de forma sencilla como si fuera para un niño:\n{data.texto}",
                "quiz"      => $"Crea un quiz de 3 preguntas con opciones basado en este texto:\n{data.texto}",
                _           => data.texto
            };

            // 2. Preparación del cuerpo de la petición para Gemini
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

            // 3. Llamada a la API
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={ApiKey}";
            var response = await _httpClient.PostAsync(url, content);
            var result = await response.Content.ReadAsStringAsync();

           if (!response.IsSuccessStatusCode)
{
    Console.WriteLine(result);

    return StatusCode((int)response.StatusCode, result);
}

            // 4. Procesamiento de la respuesta de la IA
            try
            {
                using var json = JsonDocument.Parse(result);
                
                // Navegamos por el JSON de Gemini para obtener el texto generado
                var respuestaTextoIA = json.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                // Retornamos un objeto limpio al frontend
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

           var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={ApiKey}";
            var response = await _httpClient.PostAsync(url, content);
            var result = await response.Content.ReadAsStringAsync();

           if (!response.IsSuccessStatusCode)
{
    Console.WriteLine(result);

    return StatusCode((int)response.StatusCode, result);
}

            // Para el chat, devolvemos el JSON tal cual o puedes usar la misma lógica de parseo de arriba
            return Ok(result);
        }
    }
}