import { Box, ChakraProvider } from "@chakra-ui/react";
import Header from "../components/Header";
import NavBox from "../components/NavBox";
import theme from "../components/theme";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Box maxW={(300, 500, 800)} mx="auto">
        <Header />
        <Box my={10} mx={5}>
          <NavBox>
            <Component {...pageProps} />
          </NavBox>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default MyApp;
