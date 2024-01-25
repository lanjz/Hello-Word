import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface BaseResponse {
  responseCode: number;
  message: string[];
}

export interface SuccessResponse<T> extends BaseResponse {
  data: T;
}

@Injectable()
export class ResponseFormatMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 拦截所有路由，对响应进行格式化处理
    const originalSend = res.send;
    console.log('ResponseFormatMiddleware', res);
    res.send = function (body): any {
      if (Buffer.isBuffer(body)) {
        console.log('body----')
        // 如果是 Buffer 类型的响应，则不做格式化处理
        originalSend.call(this, body);
      } else {
        const formattedResponse: SuccessResponse<any> = {
          responseCode: res.statusCode === 200 ? 1 : -1,
          message: ['成功'],
          data: body,
        };
        originalSend.call(this, formattedResponse);
      }
    };

    next();
  }
}
