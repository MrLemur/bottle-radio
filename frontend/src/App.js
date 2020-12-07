import React from "react";
import "./App.css";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import Container from "./components/Container";
import PlayerEmbed from "./components/PlayerEmbed";
import chakraTheme from "@chakra-ui/theme";

let theme = { ...chakraTheme };
theme.config.initialColorMode = "dark";
theme.config.useSystemColorMode = true;

function App() {
  const path = window.location.pathname;
  return (
    <div className="App">
      {path === "/embed" ? (
        <PlayerEmbed />
      ) : (
        <ChakraProvider theme={theme}>
          <CSSReset />
          <Container />
        </ChakraProvider>
      )}
    </div>
  );
}

export default App;
