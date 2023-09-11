import { Pokemon } from "../api";

const Pokemon = ({ pokemon }: { pokemon: Pokemon }) => {
  return <div className="pokemon">{pokemon.name}</div>;
};

const PokemonList = ({ pokemons }: { pokemons: Pokemon[] }) => {
  return (
    <div className="pokemons-container">
      {pokemons.map((pokemon, i) => (
        <Pokemon pokemon={pokemon} key={i} />
      ))}
    </div>
  );
};

export default PokemonList;
