import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import PokemonCard from '../components/PokemonCard';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const [pokemonList, setPokemonList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const fetchPokemonList = async () => {
    try {
      const response = await axios.get('http://localhost:5145/api/pokemon/all/details');
      setPokemonList(response.data);
      setHasMore(false);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  useEffect(() => {
    fetchPokemonList();
  }, []);

  return (
    <InfiniteScroll
      dataLength={pokemonList.length}
      next={fetchPokemonList}
      hasMore={hasMore}
      loader={<h4>{t('loading')}...</h4>}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {pokemonList.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default Home;
