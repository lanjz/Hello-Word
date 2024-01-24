import {
	SetMetadata,
	Injectable,
	ExecutionContext,
	CanActivate
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core'
import {HttpStatusError} from "@/utils/httpStatus.service";
import {jwtConstants} from "@/resource/auth/constants";
import { CookieKey } from '@/utils/const'

export const IS_PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService, private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		console.log('isPublic', isPublic)
		if (isPublic) {
			// 💡 查看此条件
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const tokenFromCookie = this.extractTokenFromCookie(request);
		const token = tokenFromCookie || this.extractTokenFromHeader(request);
		if (!token) {
			HttpStatusError.fail(`未登录`, 'Unauthorized', -3)
		}
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: jwtConstants.secret
			});
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
	private extractTokenFromCookie(request: Request): string | undefined {
		return request.cookies[CookieKey];
	}
}
