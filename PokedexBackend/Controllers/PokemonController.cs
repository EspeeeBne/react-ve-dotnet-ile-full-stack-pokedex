using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class PokemonController : ControllerBase
{
    private readonly PokeApiService _pokeApiService;

    public PokemonController(PokeApiService pokeApiService)
    {
        _pokeApiService = pokeApiService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPokemon(int id)
    {
        try
        {
            var pokemon = await _pokeApiService.GetPokemonAsync(id);
            return Ok(pokemon);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Hata: {ex.Message}");
        }
    }

    [HttpGet("search/{name}")]
    public async Task<IActionResult> SearchPokemonByName(string name)
    {
        var pokemon = await _pokeApiService.SearchPokemonByNameAsync(name);
        if (pokemon == null || !pokemon.Any())
        {
            return NotFound("Pokemon not found");
        }
        return Ok(pokemon);
    }


    [HttpGet("all/details")]
    public async Task<IActionResult> GetAllPokemonDetails()
    {
        try
        {
            var allPokemonDetails = await _pokeApiService.GetAllPokemonDetailsAsync();
            return Ok(allPokemonDetails);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Hata: {ex.Message}");
        }
    }
}


