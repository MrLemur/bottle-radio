import React from "react";
import "./App.css";
import { extendTheme, ChakraProvider, CSSReset } from "@chakra-ui/react";
import Container from "./components/Container";
import PlayerEmbed from "./components/PlayerEmbed";

const config = {
  useSystemColorMode: true,
  initialColorMode: "dark",
};

const customTheme = extendTheme({ config });

function App() {
  const path = window.location.pathname;
  return (
    <div className="App">
      {path === "/embed" ? (
        <PlayerEmbed />
      ) : (
        <ChakraProvider theme={customTheme}>
          <CSSReset />
          <Container />
        </ChakraProvider>
      )}
    </div>
  );
}

export default App;
