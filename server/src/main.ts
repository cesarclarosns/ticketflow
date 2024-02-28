import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { Logger } from 'nestjs-pino';

import { MongooseExceptionFilter } from '@/common/libs/filters/mongoose-exception.filter';

import { AppModule } from './app.module';
import { CorsError } from './common/errors/cors.error';
import { CorsExceptionFilter } from './common/libs/filters/cors-exception.filter';
import { config } from './config';

// mongoose.set('debug', true);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Set logger
  app.useLogger(app.get(Logger));

  // Set cors
  const allowedOrigins = config.CORS.ALLOWED_ORIGINS.split(',');

  app.enableCors({
    credentials: true,
    origin: (origin, cb) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        return cb(null, true);
      }
      return cb(new CorsError('Not allowed by CORS.'));
    },
  });

  const apiPrefix = config.APP.API_PATH;

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(
    new MongooseExceptionFilter(),
    new CorsExceptionFilter(),
  );
  app.use(helmet());
  app.use(cookieParser());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Setting OpenAPI docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('RESTful API project')
    .setDescription('This is an RESTful API project for the SDJS-102 course.')
    .setVersion('1.0')
    .addCookieAuth(
      'refreshToken',
      {
        in: 'cookie',
        name: 'refreshToken',
        type: 'apiKey',
      },
      'refreshToken',
    )
    .addBearerAuth(
      {
        in: 'header',
        name: 'accessToken',
        scheme: 'bearer',
        type: 'http',
      },
      'accessToken',
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs/api`, app, swaggerDocument);

  const port = config.APP.LISTENING_PORT;
  await app.listen(port);
}
bootstrap();
