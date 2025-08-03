/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const sslRootCas = require('ssl-root-cas');
import morgan from 'morgan';
import * as Https from 'https';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET, HEAD, PUT, POST, PATCH, DELETE, OPTIONS',
    credentials: true,
  });

  const PORT = process.env.PORT || 7001;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(morgan('dev'));
  // Default body parsers
  app.use(json({ limit: '50mb' }) as any);
  app.use(urlencoded({ extended: true, limit: '50mb' }) as any);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.disable('x-powered-by');

  app.setGlobalPrefix('/v1', {
    exclude: ['/'],
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  Https.globalAgent.options.ca = sslRootCas.create();

  const config = new DocumentBuilder()
    .setTitle('Games Lobby')
    .setDescription('Games Lobby API.  CRUD functionality')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(PORT).then(() => {
    console.log(`Application Running On: http://localhost:${PORT}`);
    console.log(
      `🚀🚀 Swagger Doc Listening at http://localhost:${PORT}/swagger`,
    );
  });
  app.getHttpServer().setTimeout(120000);
}
bootstrap();
