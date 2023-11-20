// httpStatus.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class HttpStatusError {
  static fail(message, error?, code?) {
    throw new HttpException(
      { statusCode: code || -1, message, error: error || message },
      200,
    );
  }
}
