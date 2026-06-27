import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🌍 Global API prefix
  app.setGlobalPrefix('api');

  // ✅ Enable DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // remove extra fields
      forbidNonWhitelisted: true, // throw error on extra fields
      transform: true,            // auto-transform payloads
    }),
  );

  // 🔐 Security headers
  app.use(helmet());

  // 🌐 Enable CORS
  app.enableCors({
    origin: [
      'http://192.168.1.12:3003',
      'http://10.50.0.104:3003',
      'http://localhost:3000',
      'http://localhost:3003',
    ],
    credentials: true,
  });

  // 🔁 Trust proxy (IMPORTANT for your proxy architecture)
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}/api`);
}
bootstrap();
