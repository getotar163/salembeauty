export interface AppConfig {
  port: number;
  env: string;
  url: string;
  apiPrefix: string;
}

export const appConfig = (): { app: AppConfig } => ({
  app: {
    port: parseInt(process.env.APP_PORT || '3000', 10),
    env: process.env.APP_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost:3000',
    apiPrefix: process.env.API_PREFIX || 'api',
  },
});
