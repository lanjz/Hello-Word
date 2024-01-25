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
	// todo
	// 创建一个数据库表或集合来存储已撤销的令牌（撤销列表）。
	// 在用户退出登录时，将该用户的访问令牌（Access Token）加入到撤销列表中。
	// 在每次验证令牌时，先检查令牌是否在撤销列表中。如果在列表中，就认为令牌无效。
	// 定期清理过期的令牌记录，以减小撤销列表的大小。
	signOut(token) {
		// this.jwtService.addToBlacklist(token);
	}
}
