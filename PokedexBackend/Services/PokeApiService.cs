using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PokedexBackend.Models;

namespace PokedexBackend.Services
{
    public class PokeApiService
    {
        private readonly HttpClient _httpClient;
        private readonly LocalJsonStorageService _localJsonStorage;

        public PokeApiService(HttpClient httpClient, LocalJsonStorageService localJsonStorage)
        {
            _httpClient = httpClient;
            _localJsonStorage = localJsonStorage;
        }
        public async Task<PokemonDetail> GetPokemonAsync(int id)
        {
            var paginatedResponse = await _localJsonStorage.LoadPokemonDataAsync();
            var existingPokemon = paginatedResponse.Data.FirstOrDefault(p => p.Id == id);

            if (existingPokemon != null)
            {
                return existingPokemon;
            }

            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/pokemon/{id}");
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Pokémon with ID '{id}' not found.");
            }

            var json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);

            var speciesResponse = await _httpClient.GetAsync(data["species"]?["url"]?.ToString());
            if (!speciesResponse.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to fetch species details for Pokémon ID {id}: {speciesResponse.StatusCode}");
            }

            var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
            var speciesData = JObject.Parse(speciesJson);

            var generation = speciesData["generation"]?["name"]?.ToString() ?? "Unknown";
            var region = GetRegionFromGeneration(generation) ?? "Unknown";
            var growthRate = speciesData["growth_rate"]?["name"]?.ToString() ?? "Unknown";

            var genderRate = speciesData["gender_rate"]?.ToObject<int>() ?? -1;
            var genderInfo = CalculateGenderRate(genderRate);

            var types = data["types"]
                ?.Select(t => t["type"]?["name"]?.ToString())
                .ToList() ?? new List<string> { "Unknown" };

            var stats = data["stats"]
                ?.Select(s => $"{s["stat"]?["name"]}: {s["base_stat"]}")
                .ToList() ?? new List<string>();

            var abilities = data["abilities"]
                ?.Select(a => new PokemonAbility
                {
                    Name = a["ability"]?["name"]?.ToString() ?? "Unknown",
                    Url = a["ability"]?["url"]?.ToString() ?? "",
                    IsHidden = a["is_hidden"]?.ToObject<bool>() ?? false
                }).ToList() ?? new List<PokemonAbility>();

            var pokemonDetail = new PokemonDetail
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

            paginatedResponse.Data.Add(pokemonDetail);
            paginatedResponse.Total += 1;
            paginatedResponse.HasMore = paginatedResponse.Total < 1008;
            await _localJsonStorage.SavePokemonDataAsync(paginatedResponse.Data, paginatedResponse.Page, paginatedResponse.Limit, paginatedResponse.Total, paginatedResponse.HasMore);

            return pokemonDetail;
        }

        public async Task<PokemonDetail> SearchPokemonByNameAsync(string name)
        {
            var paginatedResponse = await _localJsonStorage.LoadPokemonDataAsync();
            var existingPokemon = paginatedResponse.Data.FirstOrDefault(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));

            if (existingPokemon != null)
            {
                return existingPokemon;
            }

            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/pokemon/{name.ToLower()}");
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Pokémon with name '{name}' not found.");
            }
            var json = await response.Content.ReadAsStringAsync();

            var data = JObject.Parse(json);

            var speciesResponse = await _httpClient.GetAsync(data["species"]?["url"]?.ToString());
            if (!speciesResponse.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to fetch species details for Pokémon '{name}': {speciesResponse.StatusCode}");
            }
            var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
            var speciesData = JObject.Parse(speciesJson);

            var generation = speciesData["generation"]?["name"]?.ToString() ?? "Unknown";
            var region = GetRegionFromGeneration(generation) ?? "Unknown";
            var growthRate = speciesData["growth_rate"]?["name"]?.ToString() ?? "Unknown";

            var genderRate = speciesData["gender_rate"]?.ToObject<int>() ?? -1;
            var genderInfo = CalculateGenderRate(genderRate);

            var types = data["types"]
                ?.Select(t => t["type"]?["name"]?.ToString())
                .ToList() ?? new List<string> { "Unknown" };

            var stats = data["stats"]
                ?.Select(s => $"{s["stat"]?["name"]}: {s["base_stat"]}")
                .ToList() ?? new List<string>();

            var abilities = data["abilities"]
                ?.Select(a => new PokemonAbility
                {
                    Name = a["ability"]?["name"]?.ToString() ?? "Unknown",
                    Url = a["ability"]?["url"]?.ToString() ?? "",
                    IsHidden = a["is_hidden"]?.ToObject<bool>() ?? false
                }).ToList() ?? new List<PokemonAbility>();

            var pokemonDetail = new PokemonDetail
            {
                Id = data["id"]?.ToObject<int>() ?? 0,
                Name = data["name"]?.ToString() ?? "Unknown",
                Types = types,
                Stats = stats,
                ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{data["id"]?.ToObject<int>()}.png",
                Height = (data["height"]?.ToObject<double>() ?? 0.0) / 10,
                Weight = (data["weight"]?.ToObject<double>() ?? 0.0) / 10,
                Abilities = abilities,
                Generation = generation,
                Region = region,
                GrowthRate = growthRate,
                GenderRate = genderInfo
            };

            paginatedResponse.Data.Add(pokemonDetail);
            paginatedResponse.Total += 1;
            paginatedResponse.HasMore = paginatedResponse.Total < 10197;
            await _localJsonStorage.SavePokemonDataAsync(paginatedResponse.Data, paginatedResponse.Page, paginatedResponse.Limit, paginatedResponse.Total, paginatedResponse.HasMore);

            return pokemonDetail;
        }

        public async Task UpdateCacheAsync()
        {
            await _localJsonStorage.ClearPokemonDataAsync();
            var paginatedResponse = new PaginatedPokemonResponse
            {
                Data = new List<PokemonDetail>(),
                Page = 1,
                Limit = 100,
                Total = 0,
                HasMore = true
            };

            await _localJsonStorage.SavePokemonDataAsync(paginatedResponse.Data, paginatedResponse.Page, paginatedResponse.Limit, paginatedResponse.Total, paginatedResponse.HasMore);

            var allPokemon = await GetAllPokemonDetailsAsync();

            await _localJsonStorage.SavePokemonDataAsync(allPokemon, paginatedResponse.Page, paginatedResponse.Limit, allPokemon.Count, false);

            Console.WriteLine("Cache successfully updated with all Pokémon data.");
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

        public async Task<List<PokemonDetail>> GetAllPokemonDetailsAsync()
        {
            var pokemonList = new List<PokemonDetail>();
            var lastOffset = 0;
            bool continueFetching = true;

            while (continueFetching)
            {
                Console.WriteLine($"Fetching Pokémon with offset {lastOffset}...");

                var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/pokemon?offset={lastOffset}&limit=100");
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Failed to fetch Pokémon list at offset {lastOffset}: {response.StatusCode}");
                    break;
                }

                var json = await response.Content.ReadAsStringAsync();
                var data = JObject.Parse(json);

                var results = data["results"];
                if (results == null || !results.Any())
                {
                    Console.WriteLine("No more Pokémon to fetch.");
                    continueFetching = false;
                    break;
                }

                foreach (var pokemon in results)
                {
                    var url = pokemon["url"]?.ToString();
                    if (string.IsNullOrEmpty(url))
                    {
                        Console.WriteLine("Pokémon URL is null or empty, skipping.");
                        continue;
                    }

                    try
                    {
                        var detailResponse = await _httpClient.GetAsync(url);
                        if (!detailResponse.IsSuccessStatusCode)
                        {
                            Console.WriteLine($"Failed to fetch Pokémon details from {url}: {detailResponse.StatusCode}");
                            continue;
                        }

                        var detailJson = await detailResponse.Content.ReadAsStringAsync();
                        var detailData = JObject.Parse(detailJson);

                        var speciesUrl = detailData["species"]?["url"]?.ToString();
                        if (string.IsNullOrEmpty(speciesUrl))
                        {
                            Console.WriteLine($"Species URL is null or empty for Pokémon ID {detailData["id"]}, skipping.");
                            continue;
                        }

                        var speciesResponse = await _httpClient.GetAsync(speciesUrl);
                        if (!speciesResponse.IsSuccessStatusCode)
                        {
                            Console.WriteLine($"Failed to fetch species details for Pokémon ID {detailData["id"]}: {speciesResponse.StatusCode}");
                            continue;
                        }

                        var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
                        var speciesData = JObject.Parse(speciesJson);

                        var generation = speciesData["generation"]?["name"]?.ToString() ?? "Unknown";
                        var region = GetRegionFromGeneration(generation) ?? "Unknown";
                        var growthRate = speciesData["growth_rate"]?["name"]?.ToString() ?? "Unknown";

                        var genderRate = speciesData["gender_rate"]?.ToObject<int>() ?? -1;
                        var genderInfo = CalculateGenderRate(genderRate);

                        var types = detailData["types"]
                            ?.Select(t => t["type"]?["name"]?.ToString())
                            .ToList() ?? new List<string> { "Unknown" };

                        var stats = detailData["stats"]
                            ?.Select(s => $"{s["stat"]?["name"]}: {s["base_stat"]}")
                            .ToList() ?? new List<string>();

                        var abilities = detailData["abilities"]
                            ?.Select(a => new PokemonAbility
                            {
                                Name = a["ability"]?["name"]?.ToString() ?? "Unknown",
                                Url = a["ability"]?["url"]?.ToString() ?? "",
                                IsHidden = a["is_hidden"]?.ToObject<bool>() ?? false
                            }).ToList() ?? new List<PokemonAbility>();

                        var pokemonDetail = new PokemonDetail
                        {
                            Id = detailData["id"]?.ToObject<int>() ?? 0,
                            Name = detailData["name"]?.ToString() ?? "Unknown",
                            Types = types,
                            Stats = stats,
                            ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{detailData["id"]?.ToObject<int>()}.png",
                            Height = (detailData["height"]?.ToObject<double>() ?? 0.0) / 10,
                            Weight = (detailData["weight"]?.ToObject<double>() ?? 0.0) / 10,
                            Abilities = abilities,
                            Generation = generation,
                            Region = region,
                            GrowthRate = growthRate,
                            GenderRate = genderInfo
                        };

                        pokemonList.Add(pokemonDetail);
                        Console.WriteLine($"Fetched and added Pokémon: {pokemonDetail.Name} (ID: {pokemonDetail.Id})");

                        await Task.Delay(100);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error fetching Pokémon details: {ex.Message}");
                        Console.WriteLine(ex.StackTrace);
                        continue;
                    }
                }

                lastOffset += results.Count();

                if (results.Count() < 100)
                {
                    Console.WriteLine("Fetched last batch of Pokémon.");
                    continueFetching = false;
                }
            }

            Console.WriteLine($"Total Pokémon fetched: {pokemonList.Count}");
            return pokemonList;
        }

        public async Task<List<EvolutionStep>> GetEvolutionChainAsync(int pokemonId)
        {
            var paginatedResponse = await _localJsonStorage.LoadPokemonDataAsync();

            var existingPokemon = paginatedResponse.Data.FirstOrDefault(p => p.Id == pokemonId);

            if (existingPokemon != null && existingPokemon.EvolutionSteps != null && existingPokemon.EvolutionSteps.Any())
            {
                return existingPokemon.EvolutionSteps;
            }

            var speciesResponse = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/pokemon-species/{pokemonId}");
            speciesResponse.EnsureSuccessStatusCode();
            var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
            var speciesData = JObject.Parse(speciesJson);

            var evolutionChainUrl = speciesData["evolution_chain"]?["url"]?.ToString();
            if (string.IsNullOrEmpty(evolutionChainUrl))
            {
                Console.WriteLine($"Evolution chain URL is null or empty for Pokémon ID {pokemonId}");
                return new List<EvolutionStep>();
            }

            var chainResponse = await _httpClient.GetAsync(evolutionChainUrl);
            chainResponse.EnsureSuccessStatusCode();
            var chainJson = await chainResponse.Content.ReadAsStringAsync();
            var chainData = JObject.Parse(chainJson);

            var evolutionSteps = new List<EvolutionStep>();
            var currentChain = chainData["chain"];

            while (currentChain != null)
            {
                var speciesName = currentChain["species"]?["name"]?.ToString();
                if (string.IsNullOrEmpty(speciesName))
                {
                    Console.WriteLine("Species name is null or empty, skipping.");
                    break;
                }

                var pokemonResponse = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/pokemon/{speciesName}");
                if (!pokemonResponse.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Failed to fetch Pokémon data for species '{speciesName}': {pokemonResponse.StatusCode}");
                    break;
                }

                var pokemonJson = await pokemonResponse.Content.ReadAsStringAsync();
                var pokemonData = JObject.Parse(pokemonJson);
                var pokemonIdFromResponse = (int)pokemonData["id"];

                evolutionSteps.Add(new EvolutionStep
                {
                    Id = pokemonIdFromResponse,
                    Name = speciesName,
                    ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemonIdFromResponse}.png",
                    LastUpdated = DateTime.UtcNow
                });

                currentChain = currentChain["evolves_to"]?.HasValues == true
                    ? currentChain["evolves_to"][0]
                    : null;
            }

            if (existingPokemon == null)
            {
                var newPokemon = new PokemonDetail
                {
                    Id = pokemonId,
                    Name = speciesData["name"]?.ToString() ?? "Unknown",
                    ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemonId}.png",
                    Types = new List<string>(),
                    Stats = new List<string>(),
                    EvolutionSteps = evolutionSteps
                };

                paginatedResponse.Data.Add(newPokemon);
            }
            else
            {
                existingPokemon.EvolutionSteps = evolutionSteps;
            }

            await _localJsonStorage.SavePokemonDataAsync(paginatedResponse.Data, paginatedResponse.Page, paginatedResponse.Limit, paginatedResponse.Total, paginatedResponse.HasMore);

            return evolutionSteps;
        }


        public async Task<List<PokemonDetail>> FilterPokemonByTypeAsync(string type)
        {
            var paginatedResponse = await _localJsonStorage.LoadPokemonDataAsync();
            var allPokemon = paginatedResponse.Data;

            var filtered = allPokemon
                .Where(p => p.Types != null && p.Types.Any(t => t.Equals(type, StringComparison.OrdinalIgnoreCase)))
                .ToList();

            return filtered;
        }

        public async Task<List<PokemonDetail>> FilterPokemonByRegionAsync(string region)
        {
            var paginatedResponse = await _localJsonStorage.LoadPokemonDataAsync();
            var allPokemon = paginatedResponse.Data;

            var filtered = allPokemon
                .Where(p => !string.IsNullOrEmpty(p.Region)
                    && p.Region.Equals(region, StringComparison.OrdinalIgnoreCase))
                .ToList();

            return filtered;
        }

        public async Task<List<PokemonDetail>> FilterPokemonByGenerationAsync(string generation)
        {
            var paginatedResponse = await _localJsonStorage.LoadPokemonDataAsync();
            var allPokemon = paginatedResponse.Data;

            var filtered = allPokemon
                .Where(p => !string.IsNullOrEmpty(p.Generation)
                    && p.Generation.Equals(generation, StringComparison.OrdinalIgnoreCase))
                .ToList();

            return filtered;
        }


        public async Task<AbilityDetail> GetAbilityDetailsAsync(int abilityId)
        {
            var paginatedResponse = await _localJsonStorage.LoadPokemonDataAsync();

            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/ability/{abilityId}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);

            var abilityDetail = new AbilityDetail
            {
                Name = data["name"]?.ToString(),
                Effect = data["effect_entries"]
                    ?.FirstOrDefault(e => e["language"]?["name"]?.ToString() == "en")?["effect"]?.ToString(),
                Pokemon = new List<PokemonBasic>()
            };

            foreach (var pokemon in data["pokemon"] ?? new JArray())
            {
                var pokemonId = int.Parse(pokemon["pokemon"]?["url"]?.ToString().Split('/')[^2] ?? "0");
                var existingPokemon = paginatedResponse.Data.FirstOrDefault(p => p.Id == pokemonId);

                if (existingPokemon == null)
                {
                    var newPokemon = await GetPokemonAsync(pokemonId);
                    abilityDetail.Pokemon.Add(new PokemonBasic
                    {
                        Id = newPokemon.Id,
                        Name = newPokemon.Name,
                        ImageUrl = newPokemon.ImageUrl,
                        Type = newPokemon.Types.FirstOrDefault() ?? "unknown"
                    });
                }
                else
                {
                    abilityDetail.Pokemon.Add(new PokemonBasic
                    {
                        Id = existingPokemon.Id,
                        Name = existingPokemon.Name,
                        ImageUrl = existingPokemon.ImageUrl,
                        Type = existingPokemon.Types.FirstOrDefault() ?? "unknown"
                    });
                }
            }

            return abilityDetail;
        }

        public async Task<List<PokemonDetail>> GetPokemonByTypeAsync(string type)
        {
            string jsonFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "pokemon_by_type.json");
            if (!File.Exists(jsonFilePath))
            {
                var initialData = new Dictionary<string, List<PokemonDetail>>();
                File.WriteAllText(jsonFilePath, JsonConvert.SerializeObject(initialData, Formatting.Indented));
            }

            var cachedData = JsonConvert.DeserializeObject<Dictionary<string, List<PokemonDetail>>>(File.ReadAllText(jsonFilePath));
            if (cachedData.ContainsKey(type))
            {
                return cachedData[type];
            }

            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/type/{type}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);

            var pokemonUrls = data["pokemon"]?.Select(p => p["pokemon"]?["url"]?.ToString()).ToList() ?? new List<string>();

            var tasks = pokemonUrls.Select(async url =>
            {
                var detailResponse = await _httpClient.GetAsync(url);
                detailResponse.EnsureSuccessStatusCode();
                var detailJson = await detailResponse.Content.ReadAsStringAsync();
                var pokemonData = JObject.Parse(detailJson);

                var speciesUrl = pokemonData["species"]?["url"]?.ToString() ?? "";
                var speciesResponse = await _httpClient.GetAsync(speciesUrl);
                speciesResponse.EnsureSuccessStatusCode();
                var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
                var speciesData = JObject.Parse(speciesJson);

                var generation = speciesData["generation"]?["name"]?.ToString() ?? "Unknown";
                var region = GetRegionFromGeneration(generation) ?? "Unknown";

                var types = pokemonData["types"]
                    ?.Select(t => t["type"]?["name"]?.ToString())
                    .ToList() ?? new List<string> { "Unknown" };

                var stats = pokemonData["stats"]
                    ?.Select(s => $"{s["stat"]?["name"]}: {s["base_stat"]}")
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
            }).ToList();

            var pokemonDetails = (await Task.WhenAll(tasks)).ToList();
            cachedData[type] = pokemonDetails;
            File.WriteAllText(jsonFilePath, JsonConvert.SerializeObject(cachedData, Formatting.Indented));

            return pokemonDetails;
        }

        public async Task<List<PokemonDetail>> GetPokemonByRegionAsync(string region)
        {
            var generation = GetGenerationFromRegion(region);

            if (generation == "Unknown")
                throw new Exception($"Region '{region}' invalid veya desteklenmiyor.");

            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/region/{region}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);

            var pokedexUrls = data["pokedexes"]
                ?.Select(p => p["url"]?.ToString())
                .Where(url => !string.IsNullOrEmpty(url))
                .ToList();

            if (pokedexUrls == null || !pokedexUrls.Any())
            {
                Console.WriteLine("No Pokedex URLs found for the specified region.");
                return new List<PokemonDetail>();
            }

            var tasks = pokedexUrls.Select(async url =>
            {
                var pokedexResponse = await _httpClient.GetAsync(url);
                pokedexResponse.EnsureSuccessStatusCode();
                var pokedexJson = await pokedexResponse.Content.ReadAsStringAsync();
                var pokedexData = JObject.Parse(pokedexJson);

                var pokemonEntries = pokedexData["pokemon_entries"]
                    ?.Select(entry => entry["pokemon_species"]?["url"]?.ToString())
                    .ToList();

                if (pokemonEntries == null || !pokemonEntries.Any())
                {
                    Console.WriteLine($"No Pokémon entries found in Pokédex URL: {url}");
                    return new List<PokemonDetail>();
                }

                var pokemonTasks = pokemonEntries.Select(async speciesUrl =>
                {
                    var speciesResponse = await _httpClient.GetAsync(speciesUrl);
                    speciesResponse.EnsureSuccessStatusCode();
                    var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
                    var speciesData = JObject.Parse(speciesJson);

                    var pokemonUrl = speciesUrl.Replace("-species", "");
                    var pokemonResponse = await _httpClient.GetAsync(pokemonUrl);
                    pokemonResponse.EnsureSuccessStatusCode();
                    var pokemonJson = await pokemonResponse.Content.ReadAsStringAsync();
                    var pokemonData = JObject.Parse(pokemonJson);

                    var stats = pokemonData["stats"]
                        ?.Select(s => $"{s["stat"]?["name"]}: {s["base_stat"]}")
                        .ToList() ?? new List<string>();

                    var types = pokemonData["types"]
                        ?.Select(t => t["type"]?["name"]?.ToString())
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
                }).ToList();

                var pokemonDetails = await Task.WhenAll(pokemonTasks);
                return pokemonDetails.ToList();
            }).ToList();

            var allPokemonDetails = (await Task.WhenAll(tasks)).SelectMany(p => p).ToList();
            return allPokemonDetails;
        }

        public async Task<List<PokemonDetail>> GetPokemonByGenerationAsync(string generation)
        {
            var region = GetGenerationFromRegion(generation);

            if (region == "Unknown")
                throw new Exception($"Generation '{generation}' invalid veya desteklenmiyor.");

            var response = await _httpClient.GetAsync($"https://pokeapi.co/api/v2/generation/{generation}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var data = JObject.Parse(json);

            var pokemonUrls = data["pokemon_species"]
                ?.Select(p => p["url"]?.ToString())
                .Where(url => !string.IsNullOrEmpty(url))
                .ToList();

            if (pokemonUrls == null || !pokemonUrls.Any())
            {
                Console.WriteLine($"No Pokémon species found for generation '{generation}'.");
                return new List<PokemonDetail>();
            }

            var tasks = pokemonUrls.Select(async url =>
            {
                var speciesResponse = await _httpClient.GetAsync(url);
                speciesResponse.EnsureSuccessStatusCode();
                var speciesJson = await speciesResponse.Content.ReadAsStringAsync();
                var speciesData = JObject.Parse(speciesJson);

                var pokemonUrl = url.Replace("-species", "");
                var pokemonResponse = await _httpClient.GetAsync(pokemonUrl);
                pokemonResponse.EnsureSuccessStatusCode();
                var pokemonJson = await pokemonResponse.Content.ReadAsStringAsync();
                var pokemonData = JObject.Parse(pokemonJson);

                var stats = pokemonData["stats"]
                    ?.Select(s => $"{s["stat"]?["name"]}: {s["base_stat"]}")
                    .ToList() ?? new List<string>();

                var types = pokemonData["types"]
                    ?.Select(t => t["type"]?["name"]?.ToString())
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
            }).ToList();

            var pokemonDetails = await Task.WhenAll(tasks);
            return pokemonDetails.ToList();
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
            return RegionGenerationMapping.GetValueOrDefault(region.ToLower(), "Unknown");
        }

        public async Task<PaginatedPokemonResponse> GetPaginatedPokemonDetailsAsync(int page, int limit)
        {
            var paginatedResponse = await _localJsonStorage.LoadPokemonDataAsync();
            var allPokemonData = paginatedResponse.Data;
            var total = allPokemonData.Count;

            var paginatedData = allPokemonData
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            var hasMore = (page * limit) < total;

            return new PaginatedPokemonResponse
            {
                Data = paginatedData,
                Page = page,
                Limit = limit,
                Total = total,
                HasMore = hasMore
            };
        }
    }
}
