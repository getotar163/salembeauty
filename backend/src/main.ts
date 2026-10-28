import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global prefix
  app.setGlobalPrefix(process.env.API_PREFIX || 'api');

  // CORS
  app.enableCors({
    origin: process.env.APP_ENV === 'production'
      ? [process.env.FRONTEND_URL || 'http://localhost:3001']
      : true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('SalemBeauty API')
    .setDescription('API для приложения салона красоты SalemBeauty')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Аутентификация и авторизация')
    .addTag('users', 'Управление пользователями')
    .addTag('masters', 'Мастера и специалисты')
    .addTag('services', 'Каталог услуг')
    .addTag('bookings', 'Запись на приём')
    .addTag('reviews', 'Отзывы и рейтинги')
    .addTag('schedule', 'Расписание мастеров')
    .addTag('notifications', 'Уведомления')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || process.env.APP_PORT || 3000;

  // In production, serve the built frontend as static files
  const frontendPath = join(process.cwd(), '..', 'frontend', 'dist');
  if (process.env.APP_ENV === 'production' && existsSync(frontendPath)) {
    app.useStaticAssets(frontendPath);
    // SPA fallback: serve index.html for all non-API routes
    const expressApp = app.getHttpAdapter().getInstance();
    const indexPath = join(frontendPath, 'index.html');
    expressApp.get(/^(?!\/api\/).*$/, (_req: any, res: any) => {
      res.sendFile(indexPath);
    });
  }

  await app.listen(port);
  console.log(`🚀 SalemBeauty API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

await bootstrap();
