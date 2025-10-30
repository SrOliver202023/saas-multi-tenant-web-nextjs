// theme.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        red: {
          50: { value: "#ffe5e5" },
          100: { value: "#EE0F0F" },
          500: { value: "#EE0F0F" },
        },
        primary: {
          DEFAULT: { value: "oklch(0.391 0.09 240.876)" },
          50: { value: "oklch(0.977 0.013 236.62)" },
          100: { value: "oklch(0.951 0.026 236.824)" },
          200: { value: "oklch(0.901 0.058 230.902)" },
          300: { value: "oklch(0.828 0.111 230.318)" },
          400: { value: "oklch(0.746 0.16 232.661)" },
          500: { value: "oklch(0.685 0.169 237.323)" },
          600: { value: "oklch(0.588 0.158 241.966)" },
          700: { value: "oklch(0.5 0.134 242.749)" },
          800: { value: "oklch(0.443 0.11 240.79)" },
          900: { value: "oklch(0.391 0.09 240.876)" },
          950: { value: "oklch(0.293 0.066 243.157)" },
        },
        light: {
          background: { value: "#f8f9fa" },
          foreground: { value: "#1a1a1a" },
        },
        dark: {
          background: { value: "#0f1115" },
          foreground: { value: "#f1f1f1" },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          value: { base: "{colors.light.background}", _dark: "{colors.dark.background}" },
        },
        fg: {
          value: { base: "{colors.light.foreground}", _dark: "{colors.dark.foreground}" },
        },
        primary: {
          value: { base: "{colors.primary.500}", _dark: "{colors.primary.300}" },
        },
        danger: {
          value: { base: "{colors.red.500}", _dark: "{colors.red.100}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
