import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

if (!process.env.DATABASE_URL) {
  const env = process.env.NODE_ENV || 'production';
  config({ path: `env/${env}.env` });
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
