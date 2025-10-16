import { z } from "zod";

/**
 * Esquema de validação das variáveis de ambiente
 */
const envSchema = z.object({
  DATABASE_URL: z.url("DATABASE_URL must be a valid URL"),
  JWT_SECRET_KEY: z.string().min(10, "JWT_SECRET_KEY is required and must be at least 10 characters long"),
  ACCESS_TOKEN_EXPIRES_IN_SECONDS: z.coerce.number().positive("ACCESS_TOKEN_EXPIRES_IN_SECONDS must be a positive number"),
  REFRESH_TOKEN_EXPIRES_IN_SECONDS: z.coerce.number().positive("REFRESH_TOKEN_EXPIRES_IN_SECONDS must be a positive number"),
  SMTP_FROM: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().positive("SMTP_PORT must be a positive number"),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number().positive("REDIS_PORT must be a positive number"),
  REDIS_DB: z.coerce.number().positive("REDIS_DB must be a positive number"),
});

/**
 * Tipo inferido a partir do schema Zod
 */
export type EnvProps = z.infer<typeof envSchema>;

/**
 * Valida e carrega as variáveis de ambiente com tipagem segura
 */
export const env: EnvProps = (() => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Erro ao validar variáveis de ambiente:");
    parsed.error.issues.forEach((err) => {
      console.error(`- ${err.path.join(".")}: ${err.message}`);
    });
    process.exit(1); // encerra o app se as envs estiverem inválidas
  }

  return parsed.data;
})();

/**
 * Helper para acessar uma variável de ambiente de forma segura e tipada
 */
export function getEnv<Key extends keyof EnvProps>(key: Key): EnvProps[Key] {
  return env[key];
}
