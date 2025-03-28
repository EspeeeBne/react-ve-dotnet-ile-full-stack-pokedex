import React, { Suspense, lazy, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Loading from './components/Fallbackloading/Loading';
import Wrapper from './components/Hoc/wrapper';
import InitialLoading from './components/backcantconnectloading/InitialLoading';

import SiteStatusContext from './contexts/SiteStatusContext';
import './i18n';

const Home = lazy(() => import('./pages/Home/Home'));
const PokemonDetail = lazy(() => import('./pages/Pokemondetail/PokemonDetail'));
const AbilityDetail = lazy(() => import('./pages/Ability/AbilityDetail'));
const ComparePokemon = lazy(() => import('./pages/Comparepokemons/ComparePokemon'));
const NotFound = lazy(() => import('./pages/404/NotFound'));

function App() {
  const [siteStatus] = useContext(SiteStatusContext);

  if (siteStatus.loading) {
    return <InitialLoading error={false} />;
  }

  if (!siteStatus.status) {
    return <InitialLoading error={true} />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading size={60} disableShrink={true} />}>
        <Routes>
          <Route element={<Wrapper />}>
            <Route
                path="/"
                element={<Home />}
            />
            <Route
                path="/pokemon/:id"
                element={<PokemonDetail />}
            />
            <Route
                path="/ability/:id"
                element={<AbilityDetail />}
            />
            <Route
                path="/compare/:id1/:id2"
                element={<ComparePokemon />}
            />
            <Route
                path="*"
                element={<NotFound />}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
