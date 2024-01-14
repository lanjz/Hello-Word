// httpStatus.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

/**
 * -1 常规错误
 * -2 账号验证失败
 * -3 未登录
 * -4 登录失效
* */
@Injectable()
export class HttpStatusError {
  static fail(message, error?, code?) {
    throw new HttpException(
      { statusCode: code || -1, message, error: error || message },
      200,
    );
  }
}
