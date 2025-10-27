// utils/emotion-cache.util.ts
import createCache from "@emotion/cache";

export const emotionCache = createCache({
  key: "chakra",
  prepend: true, // Garante que Chakra/Emotion injetem estilos antes dos outros
});
