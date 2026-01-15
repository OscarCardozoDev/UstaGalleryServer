import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_URL_FRONT,
}));
