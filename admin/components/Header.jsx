import {
  Flex,
  Heading,
  Text,
  Link,
  Icon,
  useColorMode,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex w="100%" py={2} direction="column">
      <Icon
        as={colorMode === "light" ? MoonIcon : SunIcon}
        size="xl"
        mx="auto"
        onClick={toggleColorMode}
      />
      <Heading mx="auto" size="xl">
        Admin Panel
      </Heading>
      <Text mx="auto" size="sm">
        <i>
          Powered by <Link href="https://bottleradio.com">Bottle Radio</Link>{" "}
        </i>
      </Text>
    </Flex>
  );
};

export default Header;
