using Microsoft.AspNetCore.Mvc;
using PokedexBackend.Services;

namespace PokedexBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatusController : ControllerBase
    {
        private readonly PokeApiService _pokeApiService;

        public StatusController(PokeApiService pokeApiService)
        {
            _pokeApiService = pokeApiService;
        }

        [HttpGet]
        public async Task<IActionResult> GetStatus()
        {
            bool isPokeApiAvailable = await _pokeApiService.IsServiceAvailableAsync();

            var status = new
            {
                author = "EspeeeBne",
                contact = "espeebne@proton.me",
                github = "https://github.com/EspeeeBne",
                version = "3.6.0",
                status = isPokeApiAvailable ? "OK" : "DOWN"
            };

            return Ok(status);
        }
    }
}
