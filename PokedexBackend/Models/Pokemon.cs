namespace PokedexBackend.Models
{

    public class Pokemon
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public List<string> Types { get; set; }
        public string Region { get; set; }
        public string Generation { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}