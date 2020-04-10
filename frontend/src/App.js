import React from "react";
import "./App.css";
import { ThemeProvider, ColorModeProvider, CSSReset } from "@chakra-ui/core";
import Container from "./components/Container";
import PlayerEmbed from "./components/PlayerEmbed.jsx";

function App() {
  const path = window.location.pathname;
  return (
    <div className='App'>
      <ThemeProvider>
        {path === "/embed" ? (
          <PlayerEmbed />
        ) : (
          <ColorModeProvider>
            <CSSReset />
            <Container />
          </ColorModeProvider>
        )}
      </ThemeProvider>
    </div>
  );
}

export default App;
