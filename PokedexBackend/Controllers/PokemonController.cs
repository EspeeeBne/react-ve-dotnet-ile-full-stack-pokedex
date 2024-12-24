using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using PokedexBackend.Services;
using PokedexBackend.Models;

namespace PokedexBackend.Controllers
{
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
                return StatusCode(500, $"Error: {ex.Message}");
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
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("ability/{abilityId}")]
        public async Task<IActionResult> GetAbilityDetails(int abilityId)
        {
            try
            {
                var abilityDetails = await _pokeApiService.GetAbilityDetailsAsync(abilityId);
                if (abilityDetails == null)
                {
                    return NotFound("Ability not found");
                }
                return Ok(abilityDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("evolution/{id}")]
        public async Task<IActionResult> GetEvolutionChain(int id)
        {
            try
            {
                var evolutionChain = await _pokeApiService.GetEvolutionChainAsync(id);
                if (evolutionChain == null || !evolutionChain.Any())
                {
                    return NotFound("No evolution data available");
                }
                return Ok(evolutionChain);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("filter/type/{type}")]
        public async Task<IActionResult> GetPokemonByType(string type)
        {
            try
            {
                var pokemonByType = await _pokeApiService.GetPokemonByTypeAsync(type);
                return Ok(pokemonByType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("filter/region/{regionId}")]
        public async Task<IActionResult> GetPokemonByRegion(string regionId)
        {
            try
            {
                var pokemonByRegion = await _pokeApiService.GetPokemonByRegionAsync(regionId);
                if (pokemonByRegion == null || !pokemonByRegion.Any())
                {
                    return NotFound($"No Pokémon found in region {regionId}.");
                }
                return Ok(pokemonByRegion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("filter/generation/{generationId}")]
        public async Task<IActionResult> GetPokemonByGeneration(string generationId)
        {
            try
            {
                var pokemonByGeneration = await _pokeApiService.GetPokemonByGenerationAsync(generationId);
                if (pokemonByGeneration == null || !pokemonByGeneration.Any())
                {
                    return NotFound($"No Pokémon found in generation {generationId}.");
                }
                return Ok(pokemonByGeneration);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

    }
}
