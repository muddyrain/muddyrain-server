import * as dotenv from 'dotenv';
import * as fs from 'fs';
const envFilePath = `.env.${process.env.NODE_ENV}`;
const isHasLocal = fs.existsSync(envFilePath + '.local');

interface envTypes {
  NODE_ENV: string;
  PORT: number;
  DB: string;
  GLOBAL_PREFIX: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_HOST: string;
  MINIO_HOST: string;
  MINIO_PORT: string;
  MINIO_USE_SSL: string;
  MINIO_AK: string;
  MINIO_SK: string;
}
export const envConfig = (variable: keyof envTypes) => {
  return dotenv.configDotenv({
    path: `${envFilePath}${isHasLocal && '.local'}`,
  }).parsed[variable];
};

export const PRIVATE_KEY = 'muddyrain';
