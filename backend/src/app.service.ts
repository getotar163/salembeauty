import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthCheck(): {
    status: string;
    name: string;
    version: string;
    timestamp: string;
  } {
    return {
      status: 'ok',
      name: 'SalemBeauty API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
