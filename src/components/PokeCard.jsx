import React, { useState, useEffect } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils/index.js";
import TypeCard from "./TypeCard";
import Modal from "./Modal";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const PokeCard = (props) => {
  const { selectedPokemon } = props;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);

  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  function capatalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) return false;
    if (["versions", "other"].includes(val)) return false;
    return true;
  });

  async function fetchMoveData(moveName, moveUrl) {
    console.log(moveName);
    if (loadingSkill || !localStorage || !moveUrl) return; // if loading is happening || localstorage is not available || move url is not available then exit logic

    // check cache for move data
    let c = {};
    if (localStorage.getItem("pokemon-move")) {
      c = JSON.parse(localStorage.getItem("pokemon-move"));
    }

    // check if the move data is in the cache
    if (moveName in c) {
      setSkill(c[moveName]);
      console.log("Found move data in cache");
      return;
    }

    try {
      setLoadingSkill(true);
      const response = await fetch(moveUrl);
      const moveData = await response.json();
      const description = moveData.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      ).flavor_text;

      const skillData = {
        name: moveName,
        description,
      };
      setSkill(skillData);
      console.log("Fetched move data from API");
      c[moveName] = skillData;
      localStorage.setItem("pokemon-move", JSON.stringify(c));
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoadingSkill(false);
    }
  }

  useEffect(() => {
    if (loading || !localStorage) return; // if loading, exit logic

    // check if the selected pokemon information is available in the cache
    // 1. define the cache object
    let cache = {};
    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }

    // 2. check if the selected pokemon is in the cache, otherwise fetch from API

    if (selectedPokemon in cache) {
      setData(cache[selectedPokemon]);
      return;
    }

    // 3. fetch the selected pokemon data from the API
    // we passed all the cache stuff to no avail and now need to fetch the data from the api

    async function fetchPokemonData() {
      setLoading(true);
      try {
        const baseUrl = "https://pokeapi.co/api/v2/pokemon/";
        const suffix = getPokedexNumber(selectedPokemon);
        const response = await fetch(baseUrl + suffix);
        const pokemonData = await response.json();
        setData(pokemonData);
        console.log("Fetched pokemon data from API");
        cache[selectedPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemonData();
    // if we fetch from the api, make sure to save the information to the cache for next time
  }, [selectedPokemon]);

  // if loading or no data, display loading message
  if (loading || !data) {
    return (
      <DotLottieReact
        src="https://lottie.host/fb2f2bd9-3a5b-40fe-ad69-7d3dc8efe394/kw8UUzS2my.lottie"
        loop
        autoplay
        className="loader"
      />
    );
  }

  return (
    <>
      <div className="poke-card">
        {skill && (
          <Modal
            handleCloseModal={() => {
              setSkill(null);
            }}
          >
            <div>
              <h6>Attack Name :</h6>
              <h2 className="skill-name">{skill.name.replaceAll("-", " ")}</h2>
            </div>
            <div>
              <h6 >Description :</h6>
              <p style={{color: "orange"}}>{skill.description}</p>
            </div>
          </Modal>
        )}

        <div>
          <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
          <h2>{capatalizeFirstLetter(name)}</h2>
        </div>
        <div className="type-container">
          {types.map((typeObj, typeIndex) => {
            return <TypeCard key={typeIndex} type={typeObj?.type?.name} />;
          })}
        </div>

        <div className="default-img-container">
          <img
            className="default-img"
            src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
            alt={`${name}-large-img`}
          />
        </div>
        <div className="img-container">
          {imgList.map((spriteUrl, spriteIndex) => {
            const imgUrl = sprites[spriteUrl];
            return (
              <img
                key={spriteIndex}
                src={imgUrl}
                alt={`${name}-img-${spriteUrl}`}
              />
            );
          })}
        </div>

        <h3>Stats</h3>
        <div className="stats-card">
          {stats.map((statObj, statIndex) => {
            const { stat, base_stat } = statObj;
            return (
              <div key={statIndex} className="stat-item">
                <p>{stat?.name.replaceAll("-", " ")}</p>
                <h4>{base_stat}</h4>
              </div>
            );
          })}
        </div>

        <h3>Moves</h3>
        <div className="pokemon-move-grid">
          {moves.map((moveObj, moveIndex) => {
            return (
              <button
                className="button-card pokemon-move"
                key={moveIndex}
                onClick={() => {
                  fetchMoveData(moveObj?.move?.name, moveObj?.move?.url);
                }}
              >
                <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PokeCard;
