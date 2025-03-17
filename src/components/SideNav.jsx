import React, { useState } from "react";
import {first151Pokemon, getFullPokedexNumber} from "../utils/Index";

const SideNav = (props) => {
  const { selectedPokemon, setSelectedPokemon, sideMenu, handleCloseMenu, } = props;
  const [searchValue, setSearchValue] = useState("");

  const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
    // if full pokedex number includes search value
    if (getFullPokedexNumber(eleIndex).includes(searchValue)) {
      return true;
    }
    // if pokemon name includes search value
    if (ele.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }
    // otherwise, exclude value from the array
    return false;
  });

  return (
    <nav className={"" + (!sideMenu ? "open" : "")}>
      <div className={"header" + (!sideMenu ? "open" : "")}>
        <div className="open-nav-button" onClick={handleCloseMenu}>
          <i className="fa-solid fa-arrow-left-long"></i>
        </div>
        <h1 className="text-gradient">Pokédex</h1>
      </div>

      <input
        placeholder="E.g. 001 or Bulbasaur..."
        type="text"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />

      {filteredPokemon.map((pokemon, pokemonIndex) => {
        const truePokedexNumber = first151Pokemon.indexOf(pokemon);
        return (
          <button
            onClick={() => {
              setSelectedPokemon(truePokedexNumber);
              handleCloseMenu();
            }}
            className={
              "nav-card" +
              (pokemonIndex === selectedPokemon ? " nav-card-selected" : "")
            }
            key={pokemonIndex}
          >
            <p>{getFullPokedexNumber(truePokedexNumber)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
};

export default SideNav;
