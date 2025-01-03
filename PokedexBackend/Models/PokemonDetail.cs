namespace PokedexBackend.Models
{

    public class PokemonDetail
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public List<string> Types { get; set; }
        public List<string> Stats { get; set; }
        public double Height { get; set; }
        public double Weight { get; set; }
        public List<PokemonAbility> Abilities { get; set; }
        public string Region { get; set; }
        public string Generation { get; set; }
        public string GrowthRate { get; set; }
        public DateTime LastUpdated { get; set; }
        public GenderRate GenderRate { get; set; }
        public List<EvolutionStep> EvolutionSteps { get; set; }
    }


    public class GenderRate
    {
        public double MalePercentage { get; set; }
        public double FemalePercentage { get; set; }
    }

}