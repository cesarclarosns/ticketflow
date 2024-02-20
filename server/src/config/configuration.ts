import * as Joi from 'joi'

export const CONFIG_VALUES = {
  APP: {
    API_PREFIX: 'APP.API_PREFIX',
    APP_DOMAIN: 'APP.APP_DOMAIN',
    LISTENING_PORT: 'APP.LISTENING_PORT',
    SMTP_HOST: 'APP.SMTP_HOST',
    SMTP_USER: 'APP.SMTP_USER',
    SMTP_PASS: 'APP.SMTP_PASS',
    SMTP_EMAIL: 'APP.SMTP_EMAIL',
  },
  AUTH: {
    JWT_ACCESS_EXPIRES_IN: 'AUTH.JWT_ACCESS_EXPIRES_IN',
    JWT_ACCESS_SECRET: 'AUTH.JWT_ACCESS_SECRET',
    JWT_REFRESH_EXPIRES_IN: 'AUTH.JWT_REFRESH_EXPIRESIN',
    JWT_REFRESH_SECRET: 'AUTH.JWT_REFRESH_SECRET',
    JWT_RESET_PASSWORD_EXPIRES_IN: 'AUTH.JWT_RESET_PASSWORD_EXPIRES_IN',
    JWT_RESET_PASSWORD_SECRET: 'AUTH.JWT_RESET_PASSWORD_SECRET',
  },
  DATABASE: {
    URI: 'DATABASE.URI',
  },
  THROTTLER: {
    LIMIT: 'THROTTLER.LIMIT',
    TTL: 'THROTTLER.TTL',
  },
}

export const configValidationSchema = Joi.object({
  API_PREFIX: Joi.string().min(0).required(),
  LISTENING_PORT: Joi.number().equal(4000).required(),
  THROTTLE_TTL: Joi.number().required(),
  THROTTLE_LIMIT: Joi.number().max(15).required(),
  MONGODB_URI: Joi.string().required(),
  APP_DOMAIN: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_RESET_PASSWORD_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().equal('15m').required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().equal('7d').required(),
  JWT_RESET_PASSWORD_EXPIRES_IN: Joi.string().equal('2h').required(),
  SMTP_HOST: Joi.string().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_EMAIL: Joi.string().email(),
})

export default () => ({
  APP: {
    API_PREFIX: process.env.API_PREFIX,
    APP_DOMAIN: process.env.APP_DOMAIN,
    LISTENIN_GPORT: parseInt(process.env.LISTENING_PORT),
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_EMAIL: process.env.SMTP_EMAIL,
  },
  auth: {
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_RESET_PASSWORD_EXPIRES_IN: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET,
  },
  DATABASE: {
    URI: process.env.MONGODB_URI,
  },
  THROTTLER: {
    LIMIT: parseInt(process.env.THROTTLE_LIMIT),
    TTL: parseInt(process.env.THROTTLE_TTL),
  },
})
