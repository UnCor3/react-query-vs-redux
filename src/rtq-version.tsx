//* React Query Version
import PokemonList from "./components/PokemonList.component";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import api, { Pokemon } from "./api";
import { useRef } from "react";
import useRenderCount from "./hooks/useRenderCount.hook";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

//New QC Instance
const qc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Rtq = () => {
  const client = useQueryClient();
  const renderCount = useRenderCount();
  const {
    data: pokemons,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(["pokemons"], api.getPokemons);

  const pokemonToAdd = useRef<Pokemon | undefined>();

  const addPokemon = useMutation(
    (pokemon: Pokemon) => api.addPokemon(pokemon),
    //*Refetching on success to get latest Pokemons
    {
      onSuccess: () => refetch(),
    }
  );

  const handleAddPokemon = () => {
    addPokemon.mutate(pokemonToAdd.current!);
  };

  if (isLoading) return <div>....Loading</div>;
  if (isError) return <div>Something went wrong {error as string}</div>;

  return (
    <div className="rtq-example">
      <h1>React Query Example</h1>
      <div>Render Count : {renderCount}</div>
      <div>Add Pokemon</div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          placeholder="Name ?"
          onChange={(e) => {
            pokemonToAdd.current = {
              name: e.target.value,
            };
          }}
        />
        <button onClick={handleAddPokemon}>Add</button>
      </div>
      <div className="controls">
        <button onClick={() => refetch()}>Refetch</button>
        <button onClick={() => client.invalidateQueries(["pokemons"])}>
          Invalidate
        </button>
      </div>
      <PokemonList pokemons={pokemons} />
    </div>
  );
};

export default () => (
  <QueryClientProvider client={qc}>
    <Rtq />
    <ReactQueryDevtools />
  </QueryClientProvider>
);
