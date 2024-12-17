using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using PokedexBackend.Models;

namespace PokedexBackend.Services
{
    public class PokeApiService
    {
        private readonly HttpClient _httpClient;

        public PokeApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<PokemonDetail> GetPokemonAsync(int id)
        {
            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/pokemon/{id}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();

            var data = JObject.Parse(json);

            var types = data["types"]
                .Select(t => t["type"]["name"].ToString())
                .ToList();

            var stats = data["stats"]
                .Select(s => new
                {
                    statName = s["stat"]["name"].ToString(),
                    baseStat = s["base_stat"].ToString()
                })
                .ToList();

            var abilities = data["abilities"]
                .Select(a => new PokemonAbility
                {
                    Name = a["ability"]["name"].ToString(),
                    Url = a["ability"]["url"].ToString(),
                    IsHidden = (bool)a["is_hidden"]
                })
                .ToList();

            return new PokemonDetail
            {
                Id = (int)data["id"],
                Name = (string)data["name"],
                Types = types,
                ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png",
                Height = (double)data["height"] / 10,
                Weight = (double)data["weight"] / 10,
                Stats = stats.Select(stat => $"{stat.statName}: {stat.baseStat}").ToList(),
                Abilities = abilities
            };
        }

        public async Task<List<Pokemon>> SearchPokemonByNameAsync(string name)
        {
            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/pokemon/{name}");
            if (!response.IsSuccessStatusCode)
            {
                return new List<Pokemon>();
            }

            var json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);

            return new List<Pokemon>
            {
                new Pokemon
                {
                    Id = (int)data["id"],
                    Name = (string)data["name"],
                    ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{data["id"]}.png",
                    Types = data["types"].Select(t => t["type"]["name"].ToString()).ToList(),
                }
            };
        }

        public async Task<List<PokemonDetail>> GetAllPokemonDetailsAsync()
        {
            var response = await _httpClient.GetAsync("https://pokeapi.co/api/v2/pokemon?limit=100");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var pokemonList = JObject.Parse(json)["results"];

            var tasks = pokemonList.Select(async pokemon =>
            {
                var url = pokemon["url"].ToString();
                var detailResponse = await _httpClient.GetAsync(url);
                detailResponse.EnsureSuccessStatusCode();
                var detailJson = await detailResponse.Content.ReadAsStringAsync();
                var data = JObject.Parse(detailJson);

                var types = data["types"]
                    .Select(t => t["type"]["name"].ToString())
                    .ToList();

                var abilities = data["abilities"]
                    .Select(a => new PokemonAbility
                    {
                        Name = a["ability"]["name"].ToString(),
                        Url = a["ability"]["url"].ToString(),
                        IsHidden = (bool)a["is_hidden"]
                    })
                    .ToList();

                return new PokemonDetail
                {
                    Id = (int)data["id"],
                    Name = (string)data["name"],
                    Types = types,
                    ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{(int)data["id"]}.png",
                    Height = (double)data["height"] / 10,
                    Weight = (double)data["weight"] / 10,
                    Abilities = abilities
                };
            });

            return (await Task.WhenAll(tasks)).ToList();
        }

        public async Task<List<EvolutionStep>> GetEvolutionChainAsync(int pokemonId)
        {
            var speciesResponse = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/pokemon-species/{pokemonId}");
            speciesResponse.EnsureSuccessStatusCode();
            var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
            var speciesData = JObject.Parse(speciesJson);

            var evolutionChainUrl = speciesData["evolution_chain"]["url"].ToString();
            var chainResponse = await _httpClient.GetAsync(evolutionChainUrl);
            chainResponse.EnsureSuccessStatusCode();
            var chainJson = await chainResponse.Content.ReadAsStringAsync();
            var chainData = JObject.Parse(chainJson);

            var evolutionSteps = new List<EvolutionStep>();
            var currentChain = chainData["chain"];

            while (currentChain != null)
            {
                var speciesName = currentChain["species"]["name"].ToString();

                var pokemonResponse = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/pokemon/{speciesName}");
                pokemonResponse.EnsureSuccessStatusCode();
                var pokemonJson = await pokemonResponse.Content.ReadAsStringAsync();
                var pokemonData = JObject.Parse(pokemonJson);
                var pokemonIdFromResponse = (int)pokemonData["id"];

                evolutionSteps.Add(new EvolutionStep
                {
                    Id = pokemonIdFromResponse,
                    Name = speciesName,
                    ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemonIdFromResponse}.png"
                });

                currentChain = currentChain["evolves_to"].HasValues ? currentChain["evolves_to"][0] : null;
            }

            return evolutionSteps;
        }


        public async Task<AbilityDetail> GetAbilityDetailsAsync(int abilityId)
        {
            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/ability/{abilityId}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);

            var effect = data["effect_entries"]
                            .FirstOrDefault(e => e["language"]["name"].ToString() == "en")?["effect"]
                            ?.ToString();

            return new AbilityDetail
            {
                Name = data["name"].ToString(),
                Effect = effect ?? "No effect available",
                Pokemon = data["pokemon"]
                            .Select(p => new PokemonBasic
                            {
                                Id = int.Parse(p["pokemon"]["url"].ToString().Split('/')[6]),
                                Name = p["pokemon"]["name"].ToString()
                            })
                            .ToList()
            };
        }


    }
}
