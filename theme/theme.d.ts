/* eslint-disable @typescript-eslint/no-unused-vars */
import "@chakra-ui/react";
import type { ThemeConfig } from "@chakra-ui/react";
import { system } from "./index"; // <-- caminho para o seu tema real

type CustomTheme = typeof system;

declare module "@chakra-ui/react" {
  export type Theme = CustomTheme;
}
