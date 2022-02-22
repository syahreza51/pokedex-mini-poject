import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Grid } from '../src/components/ui/Grid';
import client from '../src/graphql/client';
import SEO from '../src/components/commons/Seo';
import PokemonsQuery from '../src/graphql/pokemons.graphql';
import debounce from '../src/utils/debounce';

const Shimmer = dynamic(() => import('../src/components/ui/Shimmer'), { ssr: false });
const PokemonItem = dynamic(() => import('../src/pages/pokemon/PokemonItem.js'), { ssr: false });

export default function Home(props) {
  const [pokemons, setPokemons] = useState(props.pokemons);
  const [getPokemon, { loading, data, error }] = useLazyQuery(PokemonsQuery);
  const [page, setPage] = useState(20);

  useEffect(() => {
    getPokemon({ variables: { limit: 20, offset: page } });
  }, [page]);

  useEffect(() => {
    if (data) {
      const {
        pokemons: { results },
      } = data;
      setPokemons([...pokemons, ...results]);
    }
  }, [data]);

  const scrollListener = debounce(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (!loading && !error) {
        setPage(prevState => prevState + 20);
      }
    }
  }, 500);

  useEffect(() => {
    window.addEventListener('scroll', scrollListener, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);

  const renderPokemonList = pokemons.map((pokemon, i) => <PokemonItem key={i} {...pokemon} />);

  return (
    <div>
      <Head>
        <link rel="prefetch" href={pokemons[0].image} />
      </Head>
      <SEO title="Pokemon dex" desc="Pokemon base of your pokemon info" />
      <Grid xs={2} sm={3} md={4} lg={6}>
        {pokemons && renderPokemonList}
        {loading && <Shimmer />}
      </Grid>
    </div>
  );
}

export async function getServerSideProps() {
  const { data } = await client.query({
    query: PokemonsQuery,
    variables: {
      offset: 0,
      limit: 20,
    },
  });

  return {
    props: {
      pokemons: data.pokemons.results,
      pokemontCount: data.pokemons.count,
    },
  };
}
