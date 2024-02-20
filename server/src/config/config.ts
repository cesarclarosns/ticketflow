import * as Joi from 'joi'

export const CONFIG_VALUES = {
  app: {
    apiPrefix: 'app.apiPrefix',
    appDomain: 'app.appDomain',
    listeningPort: 'app.listeningPort',
    smtpHost: 'app.smtpHost',
    smtpUser: 'app.smtpUser',
    smtpPass: 'app.smtpPass',
    smtpEmail: 'app.smtpEmail',
  },
  auth: {
    jwtAccessExpiresIn: 'auth.jwtAccessExpiresIn',
    jwtAccessSecret: 'auth.jwtAccessSecret',
    jwtRefreshExpiresIn: 'auth.jwtRefreshExpiresIn',
    jwtRefreshSecret: 'auth.jwtRefreshSecret',
    jwtResetPasswordExpiresIn: 'auth.jwtResetPasswordExpiresIn',
    jwtResetPasswordSecret: 'auth.jwtResetPasswordSecret',
  },
  database: {
    uri: 'database.uri',
  },
  throttler: {
    limit: 'throttler.limit',
    ttl: 'throttler.ttl',
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
  app: {
    apiPrefix: process.env.API_PREFIX,
    appDomain: process.env.APP_DOMAIN,
    listeningPort: parseInt(process.env.LISTENING_PORT),
    smtpHost: process.env.SMTP_HOST,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpEmail: process.env.SMTP_EMAIL,
  },
  auth: {
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtResetPasswordExpiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    jwtResetPasswordSecret: process.env.JWT_RESET_PASSWORD_SECRET,
  },
  database: {
    uri: process.env.MONGODB_URI,
  },
  throttler: {
    limit: parseInt(process.env.THROTTLE_LIMIT),
    ttl: parseInt(process.env.THROTTLE_TTL),
  },
})
