export interface IEnvProps {
  DATABASE_URL: string;
  JWT_SECRET_KEY: string;
}

export function getEnv(key: keyof IEnvProps): string {
  const env = process.env;
  if (env[key]) {
    return env[key];
  } else {
    throw new Error(`Env ${key} not found`);
  }
}

getEnv("DATABASE_URL");
