using System.Collections.Generic;

namespace PokedexBackend.Models
{
    public class PaginatedPokemonResponse
    {
        public List<PokemonDetail> Data { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }
        public int Total { get; set; }
        public bool HasMore { get; set; }
    }
}
