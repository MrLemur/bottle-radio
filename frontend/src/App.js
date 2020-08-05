import React from "react";
import "./App.css";
import { ChakraProvider, CSSReset } from "@chakra-ui/core";
import Container from "./components/Container";
import PlayerEmbed from "./components/PlayerEmbed";
import chakraTheme from "@chakra-ui/theme";

let theme = { ...chakraTheme };
theme.config.initialColorMode = "dark";
theme.config.useSystemColorMode = true;
console.log(theme);

function App() {
  const path = window.location.pathname;
  return (
    <div className='App'>
      <ChakraProvider theme={theme}>
        <CSSReset />
        {path === "/embed" ? <PlayerEmbed /> : <Container />}
      </ChakraProvider>
    </div>
  );
}

export default App;
