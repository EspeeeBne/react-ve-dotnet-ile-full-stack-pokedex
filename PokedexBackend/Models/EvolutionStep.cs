namespace PokedexBackend.Models
{
    public class EvolutionStep
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
