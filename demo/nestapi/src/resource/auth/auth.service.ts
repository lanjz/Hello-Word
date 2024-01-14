import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {HttpStatusError} from '@/utils/httpStatus.service';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UserService,
		private jwtService: JwtService
	) {}
	async signIn(username: string, pass: string): Promise<any> {
		const user = await this.usersService.findOneByUsername(username);
		if (user?.password !== pass) {
			HttpStatusError.fail(`账号或密码错误`, 'Unauthorized', -2);
		}
		const { password, ...result } = user;
		const payload = {
			sub: user.id,
			username: user.username,
		};
		// 而不是返回一个用户对象
		return {
			access_token: await this.jwtService.signAsync(payload)
		};
	}
}
