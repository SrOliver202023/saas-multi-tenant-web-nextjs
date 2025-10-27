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
          50: { value: "klch(0.977 0.013 236.62)" },
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
          background: { value: "#ffe5f8" },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: "{colors.bg}" },
        fg: { value: "{colors.white}" },
        primary: { value: "{colors.primary.500}" },
        danger: { value: "{colors.red.500}" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
