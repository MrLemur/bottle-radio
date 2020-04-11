import React, { useState, Fragment } from "react";
import Player from "./Player.jsx";
import Links from "./Links.jsx";
import {
  Box,
  Button,
  Flex,
  Image,
  useColorMode,
  PseudoBox,
  Code,
  Collapse,
} from "@chakra-ui/core";
import { FaSun, FaMoon } from "react-icons/fa";
import { ModalProvider, VisualiserProvider } from "./Contexts";
import Visualisation from "./Visualisation";

const Container = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const color = { light: "black", dark: "white" };
  const [logoSpinning, setLogoSpinning] = useState(false);
  const [modal, setModal] = useState();
  const [showVisualiser, setShowVisualiser] = useState(false);
  const [player, setPlayer] = useState();

  const EmbedCode = () => {
    const [show, setShow] = React.useState(false);
    const handleToggle = () => setShow(!show);

    return (
      <Box mt="auto" pt={2} mb={3} mx={2}>
        <Collapse isOpen={show}>
          <Code my={2} p={2} overflow="auto">
            {`<iframe src = '${window.location.protocol}//${window.location.host}/embed' frameborder = '0' allowtransparency = 'true' style = 'width: 100%; min-height: 150px; border: 0;'></iframe>`}
          </Code>
        </Collapse>
        <Button variantColor="blue" variant="link" onClick={handleToggle}>
          Embed player
        </Button>
      </Box>
    );
  };

  return (
    <Fragment>
      <VisualiserProvider value={{ player, setPlayer }}>
        <Box
          width="100%"
          minHeight="100vh"
          bg={colorMode === "light" ? "#99c0ff" : "#1a202c"}
          color={colorMode === "light" ? "black" : "white"}
        >
          {player && (
            <Box pos="absolute" bottom={0} left={0} pointerEvents="none">
              <Collapse isOpen={showVisualiser}>
                <Visualisation audio={player.current} />
              </Collapse>
            </Box>
          )}
          <Flex
            direction="column"
            justify="flex-start"
            align="center"
            width="100%"
            maxWidth="960px"
            minHeight="100vh"
            mx="auto"
            pt={5}
            pos="relative"
            zindex={1}
          >
            <PseudoBox
              as={colorMode === "light" ? FaMoon : FaSun}
              size="30px"
              onClick={toggleColorMode}
              color={color[colorMode]}
            />
            <Box px={5}>
              <Image
                src="/logo512.png"
                maxWidth="230px"
                mx="auto"
                mt={3}
                className={logoSpinning ? "icon-spin" : ""}
                onClick={() =>
                  logoSpinning ? setLogoSpinning(false) : setLogoSpinning(true)
                }
              />
              <ModalProvider value={{ modal, setModal }}>
                <Player />
              </ModalProvider>
              <Links />
              <Button
                mt={2}
                variant="link"
                onClick={() => setShowVisualiser(!showVisualiser)}
              >
                Visualiser
              </Button>
            </Box>
            <EmbedCode />
          </Flex>
        </Box>
      </VisualiserProvider>
    </Fragment>
  );
};

export default Container;
