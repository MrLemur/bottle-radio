import React from "react";
import { Stack, Button, Link } from "@chakra-ui/core";
import links from "../links.json";

const Links = () => (
  <Stack>
    {links.map((link) => (
      <Link href={link.href} key={link.display} isExternal>
        <Button variantColor='teal'>{link.display}</Button>
      </Link>
    ))}
  </Stack>
);

export default Links;
