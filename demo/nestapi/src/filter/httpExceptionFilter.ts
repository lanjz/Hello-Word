import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { BaseResponse } from '../middleware/response-format.middleware';

interface MsgLog extends BaseResponse {
  error: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    try {
      if (exception instanceof QueryFailedError) {
        const sqlErrorLog: MsgLog = {
          responseCode: -1,
          message: ['SQL Error'],
          error: exception.message,
        };
        response.status(500).json(sqlErrorLog);
      } else {
        const status = exception.getStatus();
        const exceptionRes: any = exception.getResponse();
        const { error, message, statusCode } = exceptionRes;
        // 为了让 class-validator 校验不通过的异常也以 200 返回
        const isControlled = exception instanceof BadRequestException;
        const msgLog: MsgLog = {
          responseCode: isControlled ? -1 : statusCode,
          message: Array.isArray(message) ? message : [message],
          error,
        };
        response.status(isControlled ? 200 : status).json(msgLog);
      }
    } catch (e) {
      response
        .status(500)
        .json({ responseCode: -1, message: [], error: exception.message });
    }
  }
}
