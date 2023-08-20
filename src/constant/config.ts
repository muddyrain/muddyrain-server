interface envTypes {
  NODE_ENV: string;
  PORT: number;
  DB: string;
  GLOBAL_PREFIX: string;
}
export const envConfig = (variable: keyof envTypes) => {
  return process.env[variable];
};

export const PRIVATE_KEY = 'muddyrain';
