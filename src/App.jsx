import Header from "./components/Header";
import SideNav from "./components/SideNav";
import PokeCard from "./components/PokeCard";
import { useState } from "react";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0);
  const [sideMenu, setSideMenu] = useState(true);// this does the opposite of what it should do (ie, when showSideMenu it true, it's actually false)

  function handleToggleMenu() {
    setSideMenu(!sideMenu);
  }

  function handleCloseMenu() {
    setSideMenu(true);
  }

  return (
    <>
      <Header handleToggleMenu={handleToggleMenu} />
      <SideNav
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
        sideMenu={sideMenu}
        handleCloseMenu={handleCloseMenu}
      />
      <PokeCard selectedPokemon={selectedPokemon}  />
    </>
  );
}

export default App;
