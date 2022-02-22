import dynamic from 'next/dynamic';
import { Grid } from '../../src/components/ui/Grid';
import { useContext } from 'react';
import { PokemonContext } from '../../src/context/pokemon.context';
import Block from '../../src/components/ui/Block';
import SEO from '../../src/components/commons/Seo';

const Empty = dynamic(() => import('../../src/components/ui/Empty'));
const PokemonOwnedItem = dynamic(() => import('../../src/pages/pokemon/PokemonOwnedItem'));

export default function Owned() {
  const { pokemons = {} } = useContext(PokemonContext);

  const renderPokemonList = Object.values(pokemons)
    .flat()
    .map((pokemon, i) => <PokemonOwnedItem key={i} {...pokemon} />);

  const renderEmpty =
    Object.keys(pokemons).length === 0 ? (
      <Block>
        <Empty />
      </Block>
    ) : null;

  return (
    <div>
      <SEO title="Pocke" desc="Save pokemon in a pocket" />
      <Grid xs={2} sm={3} md={4} lg={6}>
        {pokemons && renderPokemonList}
      </Grid>
      {renderEmpty}
    </div>
  );
}
