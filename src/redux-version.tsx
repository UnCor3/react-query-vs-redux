import {
  configureStore,
  createReducer,
  createAsyncThunk,
  SerializedError,
  combineReducers,
} from "@reduxjs/toolkit";
import {
  Provider,
  useSelector,
  TypedUseSelectorHook,
  useDispatch,
} from "react-redux";
import api, { Pokemon } from "./api";
import PokemonList from "./components/PokemonList.component";
import { useEffect, useRef } from "react";
import useRenderCount from "./hooks/useRenderCount.hook";

type PokemonsReducer = {
  error: SerializedError | null;
  pokemons: Pokemon[];
  isLoading: boolean;
};

const getPokemons = createAsyncThunk("FETCH/POKEMONS", () => {
  return api.getPokemons();
});

const addPokemon = createAsyncThunk("ADD/POKEMONS", (pokemon: Pokemon) => {
  return api.addPokemon(pokemon);
});

const pokemonReducer = createReducer<PokemonsReducer>(
  {
    error: null,
    pokemons: [],
    isLoading: false,
  },
  (builder) => {
    builder.addCase(getPokemons.pending, (s) => {
      s.isLoading = true;
    });
    builder.addCase(getPokemons.fulfilled, (s, { payload }) => {
      s.isLoading = false;
      s.pokemons = payload;
    });
    builder.addCase(getPokemons.rejected, (s, { error }) => {
      s.isLoading = false;
      s.error = error;
    });
    builder.addCase(addPokemon.fulfilled, (s) => {
      s.isLoading = false;
    });
    builder.addCase(addPokemon.rejected, (s, { error }) => {
      s.isLoading = false;
      s.error = error;
    });
    builder.addCase(addPokemon.pending, (s) => {
      s.isLoading = true;
    });
  }
);

const rootReducer = combineReducers({
  pokemon: pokemonReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

type Store = ReturnType<typeof store.getState>;
const useAppSelector: TypedUseSelectorHook<Store> = useSelector;
type AppDispatch = typeof store.dispatch;
type DispatchFunc = () => AppDispatch;
const useAppDispatch: DispatchFunc = useDispatch;

const Redux = () => {
  const renderCount = useRenderCount();
  const pokemons = useAppSelector((s) => s.pokemon.pokemons);
  const isLoading = useAppSelector((s) => s.pokemon.isLoading);
  const error = useAppSelector((s) => s.pokemon.error);

  const pokomonToAdd = useRef<Pokemon | undefined>();

  const dispatch = useAppDispatch();

  const handleAddPokemon = () => {
    dispatch(addPokemon(pokomonToAdd.current!));
    //*Need to refetch pokemons to update
    dispatch(getPokemons());
  };

  useEffect(() => {
    dispatch(getPokemons());
  }, []);

  if (isLoading) return <div>....Loading</div>;
  if (error) return <div>Something went wrong {error as string}</div>;

  return (
    <div className="redux-example">
      <h1>Redux Example</h1>
      <div>Render Count : {renderCount}</div>
      <div>Add Pokemon</div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          placeholder="Name ?"
          onChange={(e) => {
            pokomonToAdd.current = {
              name: e.target.value,
            };
          }}
        />
        <button onClick={handleAddPokemon}>Add</button>
      </div>
      <div className="controls">
        <button onClick={() => dispatch(getPokemons())}>Refetch</button>
      </div>
      <PokemonList pokemons={pokemons} />
    </div>
  );
};

export default () => (
  <Provider store={store}>
    <Redux />
  </Provider>
);
