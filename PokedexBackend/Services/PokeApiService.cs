using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

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

        return new PokemonDetail
        {
            Id = (int)data["id"],
            Name = (string)data["name"],
            Types = types,
            ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png",
            Height = (double)data["height"] / 10,
            Weight = (double)data["weight"] / 10,
            Stats = stats.Select(stat => $"{stat.statName}: {stat.baseStat}").ToList()
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
        var response = await _httpClient.GetAsync("https://pokeapi.co/api/v2/pokemon?limit=100"); //bu limit'in yan�ndaki say�y� �ok y�ksek girmeyin kullanmay� d���n�yorsan�z bu kodu girerseniz ek kod yazmal�s�n�z ya da bir db'de pokemonlar� kendiniz kaydetmelisiniz 5-6 saat s�r�yor 10000 diye ayarlay�nca
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

            return new PokemonDetail
            {
                Id = (int)data["id"],
                Name = (string)data["name"],
                Types = types,
                ImageUrl = $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{(int)data["id"]}.png",
                Height = (double)data["height"] / 10,
                Weight = (double)data["weight"] / 10
            };
        });

        return (await Task.WhenAll(tasks)).ToList();
    }
}