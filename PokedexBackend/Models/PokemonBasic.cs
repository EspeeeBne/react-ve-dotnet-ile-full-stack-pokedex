namespace PokedexBackend.Models
{
    public class PokemonBasic
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Region { get; set; }
        public string Generation { get; set; }
        public DateTime LastUpdated { get; set; }
        public string ImageUrl { get; set; }
    }
}
