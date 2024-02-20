// Import core libraries
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import helmet from 'helmet'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import { CONFIG_VALUES } from '@config/config'
import { MongooseExceptionFilter } from '@libs/filters/mongoose-exception.filter'
import { useContainer } from 'class-validator'

const allowedOrigins = [
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4000',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://enroudesk.cesarclarosns.com',
]

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: (origin, cb) => {
        //Allow requests with no origin
        if (!origin) return cb(null, true)

        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            'The CORS policy for this site does not allow access from the specified origin.'
          return cb(new Error(msg), false)
        }

        return cb(null, true)
      },
      credentials: true,
    },
  })

  const configService = app.get(ConfigService)

  // Setting up the app
  const apiPrefix = configService.getOrThrow<string>(
    CONFIG_VALUES.app.apiPrefix,
  )

  app.setGlobalPrefix(apiPrefix)

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new MongooseExceptionFilter())
  app.use(helmet())
  app.use(cookieParser())

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  // Setting OpenAPI docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('RESTful API project')
    .setDescription('This is an RESTful API project for the SDJS-102 course.')
    .setVersion('1.0')
    .addCookieAuth(
      'refreshToken',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'refreshToken',
      },
      'refreshToken',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'accessToken',
        in: 'header',
      },
      'accessToken',
    )
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup(`${apiPrefix}/docs/api`, app, swaggerDocument)

  const port = configService.getOrThrow<number>(CONFIG_VALUES.app.listeningPort)
  await app.listen(port)
}
bootstrap()
