using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using PokedexBackend.Services;
using PokedexBackend.Models;
using System;

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

        [HttpGet("refresh-cache")]
        public async Task<IActionResult> RefreshCache()
        {
            try
            {
                await _pokeApiService.UpdateCacheAsync();
                return Ok(new { Message = "Cache successfully updated." });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { Error = $"Error updating cache: {ex.Message}" });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPokemon(int id)
        {
            try
            {
                var pokemon = await _pokeApiService.GetPokemonAsync(id);
                if (pokemon != null)
                {
                    return Ok(pokemon);
                }
                else
                {
                    return NotFound(new { Message = "Pokémon bulunamadý." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = $"Hata: {ex.Message}" });
            }
        }

        [HttpGet("search/{name}")]
        public async Task<IActionResult> SearchPokemonByName(string name)
        {
            try
            {
                var pokemon = await _pokeApiService.SearchPokemonByNameAsync(name);
                if (pokemon == null)
                {
                    return NotFound(new { Message = "Pokémon bulunamadý." });
                }
                return Ok(pokemon);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = $"Hata: {ex.Message}" });
            }
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaginatedPokemon([FromQuery] int page = 1, [FromQuery] int limit = 20)
        {
            if (page < 1 || limit < 1)
            {
                return BadRequest(new { Message = "Page ve limit deðerleri 1'den küçük olamaz." });
            }

            try
            {
                var paginatedData = await _pokeApiService.GetPaginatedPokemonDetailsAsync(page, limit);
                return Ok(paginatedData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = $"Hata: {ex.Message}" });
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
                    return NotFound(new { Message = "Yetenek bulunamadý." });
                }
                return Ok(abilityDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = $"Hata: {ex.Message}" });
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
                    return NotFound(new { Message = "Evrim verisi mevcut deðil." });
                }
                return Ok(evolutionChain);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = $"Hata: {ex.Message}" });
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
                return StatusCode(500, new { Error = $"Hata: {ex.Message}" });
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
                    return NotFound(new { Message = $"Bölgede ({regionId}) Pokémon bulunamadý." });
                }
                return Ok(pokemonByRegion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = $"Hata: {ex.Message}" });
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
                    return NotFound(new { Message = $"Nesilde ({generationId}) Pokémon bulunamadý." });
                }
                return Ok(pokemonByGeneration);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = $"Hata: {ex.Message}" });
            }
        }

        [HttpPost("cache/update")]
        public async Task<IActionResult> UpdateCache()
        {
            try
            {
                await _pokeApiService.UpdateCacheAsync();
                return Ok(new { Message = "Önbellek baþarýyla güncellendi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = $"Önbellek güncellenirken hata oluþtu: {ex.Message}" });
            }
        }
    }
}
