export interface JwtConfig {
  secret: string;
  expiration: string;
  refreshSecret: string;
  refreshExpiration: string;
}

export const jwtConfig = (): { jwt: JwtConfig } => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiration: process.env.JWT_EXPIRATION || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
});
