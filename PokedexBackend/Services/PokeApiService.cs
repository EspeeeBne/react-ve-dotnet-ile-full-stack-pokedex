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

            var speciesResponse = await _httpClient.GetAsync(data["species"]["url"].ToString());
            speciesResponse.EnsureSuccessStatusCode();
            var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
            var speciesData = JObject.Parse(speciesJson);

            var generation = speciesData["generation"]?["name"]?.ToString() ?? "Unknown";
            var region = GetRegionFromGeneration(generation) ?? "Unknown";
            var growthRate = speciesData["growth_rate"]?["name"]?.ToString() ?? "Unknown";

            var genderRate = speciesData["gender_rate"]?.ToObject<int>() ?? -1;
            GenderRate genderInfo = CalculateGenderRate(genderRate);

            var types = data["types"]?.Select(t => t["type"]["name"]?.ToString()).ToList() ?? new List<string> { "Unknown" };
            var stats = data["stats"]
                ?.Select(s => $"{s["stat"]["name"].ToString()}: {s["base_stat"]}")
                .ToList() ?? new List<string>();

            var abilities = data["abilities"]?.Select(a => new PokemonAbility
            {
                Name = a["ability"]?["name"]?.ToString() ?? "Unknown",
                Url = a["ability"]?["url"]?.ToString() ?? "",
                IsHidden = a["is_hidden"]?.ToObject<bool>() ?? false
            }).ToList() ?? new List<PokemonAbility>();

            return new PokemonDetail
            {
                Id = data["id"]?.ToObject<int>() ?? 0,
                Name = data["name"]?.ToString() ?? "Unknown",
                Types = types,
                Stats = stats,
                ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png",
                Height = (data["height"]?.ToObject<double>() ?? 0.0) / 10,
                Weight = (data["weight"]?.ToObject<double>() ?? 0.0) / 10,
                Abilities = abilities,
                Generation = generation,
                Region = region,
                GrowthRate = growthRate,
                GenderRate = genderInfo
            };
        }

        private GenderRate CalculateGenderRate(int genderRate)
        {
            if (genderRate == -1)
                return new GenderRate { MalePercentage = 0, FemalePercentage = 0 };

            double femalePercentage = (genderRate / 8.0) * 100;
            double malePercentage = 100 - femalePercentage;

            return new GenderRate
            {
                MalePercentage = malePercentage,
                FemalePercentage = femalePercentage
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

                var speciesResponse = await _httpClient.GetAsync(data["species"]["url"].ToString());
                speciesResponse.EnsureSuccessStatusCode();
                var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
                var speciesData = JObject.Parse(speciesJson);

                var generation = speciesData["generation"]?["name"]?.ToString() ?? "Unknown";
                var region = GetRegionFromGeneration(generation) ?? "Unknown";

                var stats = data["stats"]
                    ?.Select(s => $"{s["stat"]["name"]?.ToString()}: {s["base_stat"]}")
                    .ToList() ?? new List<string>();

                var types = data["types"]
                    ?.Select(t => t["type"]["name"]?.ToString())
                    .ToList() ?? new List<string>();

                return new PokemonDetail
                {
                    Id = data["id"]?.ToObject<int>() ?? 0,
                    Name = data["name"]?.ToString() ?? "Unknown",
                    Types = types,
                    Stats = stats,
                    ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{data["id"]?.ToObject<int>()}.png",
                    Height = (data["height"]?.ToObject<double>() ?? 0.0) / 10,
                    Weight = (data["weight"]?.ToObject<double>() ?? 0.0) / 10,
                    Generation = generation,
                    Region = region
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

            var abilityDetail = new AbilityDetail
            {
                Name = data["name"].ToString(),
                Effect = data["effect_entries"]
                    .FirstOrDefault(e => e["language"]["name"].ToString() == "en")?["effect"].ToString(),
                Pokemon = data["pokemon"].Select(p => new PokemonBasic
                {
                    Id = int.Parse(p["pokemon"]["url"].ToString().Split('/')[^2]),
                    Name = p["pokemon"]["name"].ToString(),
                    Type = GetPokemonTypeAsync(int.Parse(p["pokemon"]["url"].ToString().Split('/')[^2])).Result
                }).ToList()
            };

            return abilityDetail;
        }


        private async Task<string> GetPokemonTypeAsync(int pokemonId)
        {
            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/pokemon/{pokemonId}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);

            return data["types"][0]["type"]["name"].ToString();
        }


        public async Task<List<PokemonDetail>> GetPokemonByTypeAsync(string type)
        {
            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/type/{type}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);

            var pokemonUrls = data["pokemon"]?.Select(p => p["pokemon"]["url"]?.ToString()).ToList() ?? new List<string>();

            var tasks = pokemonUrls.Select(async url =>
            {
                var detailResponse = await _httpClient.GetAsync(url);
                detailResponse.EnsureSuccessStatusCode();
                var detailJson = await detailResponse.Content.ReadAsStringAsync();
                var pokemonData = JObject.Parse(detailJson);

                var speciesResponse = await _httpClient.GetAsync(pokemonData["species"]["url"]?.ToString() ?? "");
                speciesResponse.EnsureSuccessStatusCode();
                var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
                var speciesData = JObject.Parse(speciesJson);

                var generation = speciesData["generation"]?["name"]?.ToString() ?? "Unknown";
                var region = GetRegionFromGeneration(generation) ?? "Unknown";

                var types = pokemonData["types"]?.Select(t => t["type"]["name"]?.ToString()).ToList() ?? new List<string> { "Unknown" };

                var stats = pokemonData["stats"]
                    ?.Select(s => $"{s["stat"]["name"]?.ToString()}: {s["base_stat"]}")
                    .ToList() ?? new List<string>();

                return new PokemonDetail
                {
                    Id = pokemonData["id"]?.ToObject<int>() ?? 0,
                    Name = pokemonData["name"]?.ToString() ?? "Unknown",
                    Types = types,
                    Stats = stats,
                    ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemonData["id"]?.ToObject<int>()}.png",
                    Height = (pokemonData["height"]?.ToObject<double>() ?? 0.0) / 10,
                    Weight = (pokemonData["weight"]?.ToObject<double>() ?? 0.0) / 10,
                    Generation = generation,
                    Region = region
                };
            });

            return (await Task.WhenAll(tasks)).ToList();
        }


        public async Task<List<PokemonDetail>> GetPokemonByRegionAsync(string region)
        {
            var generation = GetGenerationFromRegion(region);

            if (generation == "Unknown")
                throw new Exception($"Region '{region}' is invalid or not supported.");

            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/region/{region}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);

            var pokedexUrls = data["pokedexes"]
                ?.Select(p => p["url"]?.ToString())
                .Where(url => !string.IsNullOrEmpty(url))
                .ToList();

            var tasks = pokedexUrls.Select(async url =>
            {
                var pokedexResponse = await _httpClient.GetAsync(url);
                pokedexResponse.EnsureSuccessStatusCode();
                var pokedexJson = await pokedexResponse.Content.ReadAsStringAsync();
                var pokedexData = JObject.Parse(pokedexJson);

                var pokemonEntries = pokedexData["pokemon_entries"]
                    ?.Select(entry => entry["pokemon_species"]["url"].ToString())
                    .ToList();

                var pokemonTasks = pokemonEntries.Select(async speciesUrl =>
                {
                    var speciesResponse = await _httpClient.GetAsync(speciesUrl);
                    speciesResponse.EnsureSuccessStatusCode();
                    var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
                    var speciesData = JObject.Parse(speciesJson);

                    var pokemonResponse = await _httpClient.GetAsync(speciesUrl.Replace("-species", ""));
                    pokemonResponse.EnsureSuccessStatusCode();
                    var pokemonJson = await pokemonResponse.Content.ReadAsStringAsync();
                    var pokemonData = JObject.Parse(pokemonJson);

                    var stats = pokemonData["stats"]
                        ?.Select(s => $"{s["stat"]["name"]?.ToString()}: {s["base_stat"]}")
                        .ToList() ?? new List<string>();

                    var types = pokemonData["types"]
                        ?.Select(t => t["type"]["name"]?.ToString())
                        .ToList() ?? new List<string>();

                    return new PokemonDetail
                    {
                        Id = pokemonData["id"]?.ToObject<int>() ?? 0,
                        Name = pokemonData["name"]?.ToString() ?? "Unknown",
                        Types = types,
                        Stats = stats,
                        ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemonData["id"]?.ToObject<int>()}.png",
                        Height = (pokemonData["height"]?.ToObject<double>() ?? 0.0) / 10,
                        Weight = (pokemonData["weight"]?.ToObject<double>() ?? 0.0) / 10,
                        Generation = generation,
                        Region = region
                    };
                });

                return await Task.WhenAll(pokemonTasks);
            });

            return (await Task.WhenAll(tasks)).SelectMany(p => p).ToList();
        }

        public async Task<List<PokemonDetail>> GetPokemonByGenerationAsync(string generation)
        {
            var region = GetRegionFromGeneration(generation);

            if (region == "Unknown")
                throw new Exception($"Generation '{generation}' is invalid or not supported.");

            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/generation/{generation}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);

            var pokemonUrls = data["pokemon_species"]
                ?.Select(p => p["url"]?.ToString())
                .Where(url => !string.IsNullOrEmpty(url))
                .ToList();

            var tasks = pokemonUrls.Select(async url =>
            {
                var speciesResponse = await _httpClient.GetAsync(url);
                speciesResponse.EnsureSuccessStatusCode();
                var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
                var speciesData = JObject.Parse(speciesJson);

                var pokemonResponse = await _httpClient.GetAsync(url.Replace("-species", ""));
                pokemonResponse.EnsureSuccessStatusCode();
                var pokemonJson = await pokemonResponse.Content.ReadAsStringAsync();
                var pokemonData = JObject.Parse(pokemonJson);

                var stats = pokemonData["stats"]
                    ?.Select(s => $"{s["stat"]["name"]?.ToString()}: {s["base_stat"]}")
                    .ToList() ?? new List<string>();

                var types = pokemonData["types"]
                    ?.Select(t => t["type"]["name"]?.ToString())
                    .ToList() ?? new List<string>();

                return new PokemonDetail
                {
                    Id = pokemonData["id"]?.ToObject<int>() ?? 0,
                    Name = pokemonData["name"]?.ToString() ?? "Unknown",
                    Types = types,
                    Stats = stats,
                    ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemonData["id"]?.ToObject<int>()}.png",
                    Height = (pokemonData["height"]?.ToObject<double>() ?? 0.0) / 10,
                    Weight = (pokemonData["weight"]?.ToObject<double>() ?? 0.0) / 10,
                    Generation = generation,
                    Region = region
                };
            });

            return (await Task.WhenAll(tasks)).ToList();
        }


        private string GetRegionFromGeneration(string generation)
        {
            return generation switch
            {
                "generation-i" => "Kanto",
                "generation-ii" => "Johto",
                "generation-iii" => "Hoenn",
                "generation-iv" => "Sinnoh",
                "generation-v" => "Unova",
                "generation-vi" => "Kalos",
                "generation-vii" => "Alola",
                "generation-viii" => "Galar",
                "generation-ix" => "Paldea",
                _ => "Unknown"
            };
        }

        private static readonly Dictionary<string, string> RegionGenerationMapping = new Dictionary<string, string>
{
    { "kanto", "1" },
    { "johto", "2" },
    { "hoenn", "3" },
    { "sinnoh", "4" },
    { "unova", "5" },
    { "kalos", "6" },
    { "alola", "7" },
    { "galar", "8" },
    { "paldea", "9" }
};



        private string GetGenerationFromRegion(string region)
        {
            return RegionGenerationMapping.GetValueOrDefault(region, "Unknown");
        }
    }
}
