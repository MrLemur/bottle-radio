import { Flex, Box, Link, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";

const TabLink = (props) => {
  const router = useRouter();
  const { href } = props;
  const bgColour = useColorModeValue("brand.bgLight", "brand.bgDark");
  const oppositeBgColour = useColorModeValue("brand.bgDark", "brand.bgLight");

  return (
    <NextLink href={href} passHref>
      <Link variant="unstyled" _focus={{ boxShadow: null }}>
        <Box
          borderWidth={1}
          borderColor={router.pathname === href ? null : "rgba(0,0,0,0)"}
          bgColor={router.pathname === href ? bgColour : null}
          px={2}
          py={1}
          mx={1}
          mb={router.pathname === href ? -2 : 0}
          borderTopRadius="md"
          borderBottomColor={router.pathname === href ? bgColour : null}
          _hover={{ bgColor: oppositeBgColour, color: bgColour }}
        >
          {props.children}
        </Box>
      </Link>
    </NextLink>
  );
};

const NavBox = (props) => {
  const { children } = props;
  return (
    <Fragment>
      <Flex px={5}>
        <TabLink href="/">Dashboard</TabLink>
        <TabLink href="/settings/general">General</TabLink>
        <TabLink href="/settings/branding">Branding</TabLink>
        <TabLink href="/settings/live">Live Stream</TabLink>
        <TabLink href="/settings/advanced">Advanced</TabLink>
      </Flex>
      <Box borderWidth={1} p={5} borderRadius="lg" w="100%" mt="-1px">
        {children}
      </Box>
    </Fragment>
  );
};

export default NavBox;
