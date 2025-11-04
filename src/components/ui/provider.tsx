"use client";

import { ChakraProvider, defaultSystem, useToken } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
// import { system } from "../../../theme";

export function DebugColors() {
  const [primary, bg, fg] = useToken("colors", ["primary.500", "bg", "fg"]);
  console.log(`MY_COLORS_TOKEN`, { primary, bg, fg });
  return null;
}

import { system } from "@/theme/index";
export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={{ ...defaultSystem, ...system }}>
      {/* <DebugColors /> */}
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
