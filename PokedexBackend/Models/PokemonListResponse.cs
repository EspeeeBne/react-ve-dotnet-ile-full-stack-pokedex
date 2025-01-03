namespace PokedexBackend.Models
{
    public class PokemonListResponse
    {
        public List<PokemonBasic> Results { get; set; }
        public DateTime LastUpdated { get; set; }
    }

}