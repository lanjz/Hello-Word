import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import {HttpStatusError} from "@/utils/httpStatus.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			HttpStatusError.fail(`未登录`, 'Unauthorized', -3);
		}
		try {
			const payload = await this.jwtService.verifyAsync(
				token,
				{
					secret: jwtConstants.secret
				}
			);
			// 💡 在这里我们将 payload 挂载到请求对象上
			// 以便我们可以在路由处理器中访问它
			request['user'] = payload;
		} catch {
			HttpStatusError.fail(`登录失效`, 'Unauthorized', -4);
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
