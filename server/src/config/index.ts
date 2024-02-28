import dotenv from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'dev') {
  dotenv.config();
}

export const configSchema = z.object({
  APP: z.object({
    API_DOMAIN: z.string(),
    API_PATH: z.string(),
    APP_DOMAIN: z.string().url(),
    LISTENING_PORT: z.number(),
    SMTP_EMAIL: z.string().email(),
    SMTP_HOST: z.string(),
    SMTP_PASS: z.string(),
    SMTP_USER: z.string(),
  }),
  AUTH: z.object({
    GOOGLE_CALLBACK_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_RESET_PASSWORD_EXPIRES_IN: z.string(),
    JWT_RESET_PASSWORD_SECRET: z.string(),
  }),
  CORS: z.object({
    ALLOWED_ORIGINS: z.string(),
  }),
  DATABASE: z.object({
    URI: z.string().url(),
  }),
  THROTTLER: z.object({
    LIMIT: z.number(),
    TTL: z.number(),
  }),
});

export const config = configSchema.parse({
  APP: {
    API_DOMAIN: process.env.API_DOMAIN,
    API_PATH: process.env.API_PATH,
    API_SOCKET_PATH: process.env.API_SOCKET_PATH,
    APP_DOMAIN: process.env.APP_DOMAIN,
    LISTENING_PORT: parseInt(process.env.LISTENING_PORT),
    SMTP_EMAIL: process.env.SMTP_EMAIL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_USER: process.env.SMTP_USER,
  },
  AUTH: {
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_RESET_PASSWORD_EXPIRES_IN: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET,
  },
  CORS: {
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  },
  DATABASE: {
    URI: process.env.MONGODB_URI,
  },
  THROTTLER: {
    LIMIT: parseInt(process.env.THROTTLER_LIMIT),
    TTL: parseInt(process.env.THROTTLER_TTL),
  },
});
