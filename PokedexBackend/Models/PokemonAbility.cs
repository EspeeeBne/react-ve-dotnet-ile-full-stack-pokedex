using System;

namespace PokedexBackend.Models
{
    public class PokemonAbility
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        public int Id
        {
            get
            {
                if (string.IsNullOrWhiteSpace(Url)) return 0;
                var segments = Url.Split('/');
                return int.TryParse(segments[^2], out var id) ? id : 0;
            }
        }
        public bool IsHidden { get; set; }
        public List<string> Types { get; set; }
        public string Effect { get; set; }
        public string ShortEffect { get; set; }
        public List<PokemonBasic> PokemonWithAbility { get; set; } = new List<PokemonBasic>();
    }
}
