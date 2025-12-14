import { defineConfig, env as prismaEnv } from 'prisma/config';
import { config } from 'dotenv';

const env = process.env.NODE_ENV || 'development';
config({ path: `env/${env}.env` });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: prismaEnv('DATABASE_URL'),
  },
});
