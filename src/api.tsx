import pokemons from "./pokemons.json";

export type Pokemon = {
  id?: number;
  name: string;
  type?: string;
  hp?: number;
  attack?: number;
  defense?: number;
  speed?: number;
};
let cachedPokemons = pokemons;

class api {
  getPokemons(): Promise<Pokemon[]> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(cachedPokemons);
      }, 600);
    });
  }
  addPokemon(payload: Pokemon): Promise<void> {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        //@ts-ignore
        cachedPokemons = [...cachedPokemons, payload];
        resolve();
      }, 600);
    });
  }
}

export default new api();
