import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpStatusError } from '@/utils/httpStatus.service'

export interface BaseResponse {
  responseCode: number;
  message: string[];
}

export interface Response<T> extends BaseResponse {
  data: T;
}
export function resSucFormat<T>(data: T, successMessage = '成功'): Response<T> {
  return {
    responseCode: 1,
    message: [successMessage],
    data,
  };
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
        return resSucFormat(data)
      }),
    );
  }
}

/**
* file.pipe(res) 是将文件流直接写入 HTTP 响应流中，所以不会被拦截器转换
 * 拦截器只对经过框架提供的调用链传递的 Observable 进行转换处理
* */

/**
 * 用于处理 repository.update 结果的装饰器
 * 在update之前没有先查数据判断要更新数据是否存在
 * 因此通过执行 update 方法返回值来判断是否更新成功
 * 通过 返回的 affected 属性判断是否更新成功
 * */

@Injectable()
export class UpdateResultInterceptor implements NestInterceptor{
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(result => {
        if(result.affected === 0) {
          HttpStatusError.fail(`更新失败，请确认数据标识是否有效`);
        }
        return result
      })
    )
  }
}