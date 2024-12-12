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
}
