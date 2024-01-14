import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface BaseResponse {
  responseCode: number;
  message: string[];
}

export interface Response<T> extends BaseResponse {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: any) => {
        return {
          responseCode: 1,
          message: ['成功'],
          data,
        };
      }),
    );
  }
}

/**
* file.pipe(res) 是将文件流直接写入 HTTP 响应流中，所以不会被拦截器转换
 * 拦截器只对经过框架提供的调用链传递的 Observable 进行转换处理
* */