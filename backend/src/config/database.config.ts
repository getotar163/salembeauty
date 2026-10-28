import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => {
  // Render / cloud providers give a single DATABASE_URL
  const url = process.env.DATABASE_URL;
  if (url) {
    return {
      type: 'postgres',
      url,
      ssl: { rejectUnauthorized: false },
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
    };
  }

  // Local development fallback
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'salembeauty',
    password: process.env.DB_PASSWORD || 'salembeauty_dev',
    database: process.env.DB_DATABASE || 'salembeauty_db',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  };
};
