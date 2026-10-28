import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * TypeORM DataSource configuration for CLI migrations.
 * Used by `npm run migration:generate` and `npm run migration:run`.
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'salembeauty',
  password: process.env.DB_PASSWORD || 'salembeauty_dev',
  database: process.env.DB_DATABASE || 'salembeauty_db',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: true,
});
