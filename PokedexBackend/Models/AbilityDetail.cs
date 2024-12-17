namespace PokedexBackend.Models
{
    public class AbilityDetail
    {
        public string Name { get; set; }
        public string Effect { get; set; }
        public List<PokemonBasic> Pokemon { get; set; }
    }
}
