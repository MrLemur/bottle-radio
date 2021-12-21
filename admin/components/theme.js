import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    bgLight: "#FFF",
    bgDark: "#1A202C",
  },
};

const customTheme = {
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: colors,
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "brand.bgDark" : "brand.bgLight",
      },
    }),
  },
};

export default extendTheme(customTheme);
