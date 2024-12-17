namespace PokedexBackend.Models
{
    public class PokemonAbility
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public int Id
        {
            get
            {
                var segments = Url.Split('/');
                return int.Parse(segments[segments.Length - 2]);
            }
        }
        public bool IsHidden { get; set; }
    }
}
