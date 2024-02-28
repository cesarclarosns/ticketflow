import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Error } from 'mongoose';

@Catch(Error)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse() as Response;

    if (exception instanceof Error.ValidationError) {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
        errors: exception.errors,
        message: exception.message,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    } else {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
        message: exception.message,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
  }
}
