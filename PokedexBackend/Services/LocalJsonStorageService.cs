using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using PokedexBackend.Models;

namespace PokedexBackend.Services
{
    public class LocalJsonStorageService
    {
        private readonly string _directoryPath;
        private readonly string _filePath;

        public LocalJsonStorageService()
        {
            _directoryPath = @"F:\PokedexBackend\Data\";
            _filePath = Path.Combine(_directoryPath, "pokemon_data.json");

            try
            {
                if (!Directory.Exists(_directoryPath))
                {
                    Directory.CreateDirectory(_directoryPath);
                    Console.WriteLine($"Directory created at {_directoryPath}");
                }

                if (!File.Exists(_filePath))
                {
                    var initialData = new PaginatedPokemonResponse
                    {
                        Data = new List<PokemonDetail>(),
                        Page = 1,
                        Limit = 100,
                        Total = 0,
                        HasMore = true
                    };
                    File.WriteAllText(_filePath, JsonConvert.SerializeObject(initialData, Formatting.Indented));
                    Console.WriteLine($"JSON file created at {_filePath}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error initializing LocalJsonStorageService: {ex.Message}");
            }
        }

        public async Task<PaginatedPokemonResponse> LoadPokemonDataAsync()
        {
            try
            {
                var json = await File.ReadAllTextAsync(_filePath);
                var data = JsonConvert.DeserializeObject<PaginatedPokemonResponse>(json);
                return data ?? new PaginatedPokemonResponse
                {
                    Data = new List<PokemonDetail>(),
                    Page = 1,
                    Limit = 100,
                    Total = 0,
                    HasMore = true
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading Pokémon data: {ex.Message}");
                var initialData = new PaginatedPokemonResponse
                {
                    Data = new List<PokemonDetail>(),
                    Page = 1,
                    Limit = 100,
                    Total = 0,
                    HasMore = true
                };
                await SavePokemonDataAsync(initialData.Data, initialData.Page, initialData.Limit, initialData.Total, initialData.HasMore);
                return initialData;
            }
        }

        public async Task SavePokemonDataAsync(List<PokemonDetail> pokemonList, int page, int limit, int total, bool hasMore)
        {
            try
            {
                var paginatedResponse = new PaginatedPokemonResponse
                {
                    Data = pokemonList,
                    Page = page,
                    Limit = limit,
                    Total = total,
                    HasMore = hasMore
                };

                var json = JsonConvert.SerializeObject(paginatedResponse, Formatting.Indented);
                await File.WriteAllTextAsync(_filePath, json);
                Console.WriteLine("Pokémon data saved successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving Pokémon data: {ex.Message}");
            }
        }

        public async Task ClearPokemonDataAsync()
        {
            try
            {
                var emptyData = new PaginatedPokemonResponse
                {
                    Data = new List<PokemonDetail>(),
                    Page = 1,
                    Limit = 100,
                    Total = 0,
                    HasMore = true
                };

                var json = JsonConvert.SerializeObject(emptyData, Formatting.Indented);
                await File.WriteAllTextAsync(_filePath, json);
                Console.WriteLine("Pokémon data cleared successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error clearing Pokémon data: {ex.Message}");
            }
        }

        public bool IsCachePopulated()
        {
            try
            {
                var json = File.ReadAllText(_filePath);
                var data = JsonConvert.DeserializeObject<PaginatedPokemonResponse>(json);
                return data != null && data.Data != null && data.Data.Count > 0;
            }
            catch
            {
                return false;
            }
        }
    }
}
