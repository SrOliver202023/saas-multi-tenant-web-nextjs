import { z } from "zod";

/**
 * Esquema de validação das variáveis de ambiente
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL deve ser uma URL válida"),
  JWT_SECRET_KEY: z.string().min(10, "JWT_SECRET_KEY é obrigatório e deve ter no mínimo 10 caracteres"),
  ACCESS_TOKEN_EXPIRES_IN_SECONDS: z.coerce.number().positive("ACCESS_TOKEN_EXPIRES_IN_SECONDS deve ser um número positivo"),
  REFRESH_TOKEN_EXPIRES_IN_SECONDS: z.coerce.number().positive("REFRESH_TOKEN_EXPIRES_IN_SECONDS deve ser um número positivo"),
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
