import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import client from '../../src/graphql/client';
import { Grid, Column } from '../../src/components/ui/Grid';
import PokemonQuery from '../../src/graphql/pokemon.graphql';
import { ToastContext } from '../../src/context/toast.context';
import { PokemonContext } from '../../src/context/pokemon.context';
import PokemonCarousel from '../../src/pages/pokemon/PokemonCarousel';
import Heading from '../../src/components/ui/Heading';
import Block from '../../src/components/ui/Block';
import Flex from '../../src/components/ui/Flex';
import Col from '../../src/components/ui/Col';
import Item from '../../src/components/ui/Item';
import * as Button from '../../src/components/ui/Button';
import SEO from '../../src/components/commons/Seo';
import useInput from '../../src/hooks/use-input';
import Head from 'next/head';

const Input = dynamic(() => import('../../src/components/ui/Input'), { ssr: false });
const Error = dynamic(() => import('../../src/components/ui/Error'), { ssr: false });

export default function Pokemon(props) {
  const {
    pokemon: { id, weight, name, base_experience, moves, height, abilities, types, sprites },
  } = props;
  const { back_default, back_shiny, front_default, front_shiny } = sprites ?? {};
  const images = [back_default, back_shiny, front_default, front_shiny];
  const [isCanAdded, setIsCanAdded] = useState(false);
  const { value: pokemonAlias, bind, error, isValid, validate } = useInput('');
  const { open } = useContext(ToastContext);
  const { save, find } = useContext(PokemonContext);

  const handleCatch = () => {
    if (Math.random() > 0.5) {
      setIsCanAdded(true);
    } else {
      open('Failed to catch pokemon. Try again', 'danger');
    }
  };

  const handleSave = () => {
    validate();
    if (isValid) {
      if (!find(id, pokemonAlias)) {
        save(id, { name_alias: pokemonAlias, name, id, image: images[0] });
        open(`Success save ${pokemonAlias} to pocket`, 'primary');
        setIsCanAdded(false);
      } else {
        open(`Name ${pokemonAlias} already exists, please use another name`, 'danger');
      }
    }
  };

  const renderPokemonNameInput = isCanAdded && (
    <Block>
      <Input type="text" placeholder="Type pokemon alias`s" {...bind} />
      {~isValid && <Error>{error}</Error>}
    </Block>
  );

  const renderButton = isCanAdded ? (
    <Button.Primary onClick={handleSave}>Save</Button.Primary>
  ) : (
    <Button.Primary onClick={handleCatch}>Catch</Button.Primary>
  );

  return (
    <div>
      <Head>
        <link rel="prefetch" href={images[0]} />
      </Head>
      <SEO
        title={`Catch ${name} in pokedex`}
        desc={`Pokemon ${name} is the best pokemon, with ${base_experience} Base experience`}
      />
      <Block>
        <Grid xs={1} md={3} lg={4}>
          <PokemonCarousel imageList={images} />
          <Column xs={1} sm={2} md={2} lg={3}>
            <Heading>{name}</Heading>
            <Block>
              <Flex>
                <Col xs={3} md={3}>
                  <p>Weight</p>
                </Col>

                <Col xs={3} md={3}>
                  <p>: {weight}</p>
                </Col>
              </Flex>
            </Block>
            <Block>
              <Flex>
                <Col xs={3} md={3}>
                  <p>Height</p>
                </Col>

                <Col xs={3} md={3}>
                  <p>: {height}</p>
                </Col>
              </Flex>
            </Block>
            <Block>
              <Flex>
                <Col xs={3} md={3}>
                  <p>Base Experience</p>
                </Col>

                <Col xs={3} md={3}>
                  <p>: {base_experience}</p>
                </Col>
              </Flex>
            </Block>
            {renderPokemonNameInput}
            <Block>{renderButton}</Block>
          </Column>
        </Grid>
      </Block>
      <Block>
        <Heading>Type</Heading>
        <Grid xs={2} md={4} lg={6}>
          {types.map((x, i) => (
            <Item key={i}>{x.type.name}</Item>
          ))}
        </Grid>
      </Block>
      <Block>
        <Heading>Moves</Heading>
        <Grid xs={2} md={4} lg={6}>
          {moves.map((x, i) => (
            <Item key={i}>{x.move.name}</Item>
          ))}
        </Grid>
      </Block>
      <Block>
        <Heading>Abilities</Heading>
        <Grid xs={2} md={4} lg={6}>
          {abilities.map((x, i) => (
            <Item key={i}>{x.ability.name}</Item>
          ))}
        </Grid>
      </Block>
    </div>
  );
}

export async function getServerSideProps(context) {
  const {
    params: { name },
  } = context;

  const {
    data: { pokemon },
  } = await client.query({
    query: PokemonQuery,
    variables: {
      name,
    },
  });

  return {
    props: {
      pokemon,
    },
  };
}
