import { ResponseHelper } from '@/common/ResponseHelper.filter';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    const status = exception.getStatus();
    this.logger.error(exception.message, exception.stack);
    const isSkipList = [response.statusCode === 401];
    if (!isSkipList.some((item) => item)) {
      switch (status) {
        default: {
          const error = {
            code: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception.message || exception.name,
          };
          response.status(status).json(error);
        }
      }
    }
  }
}
