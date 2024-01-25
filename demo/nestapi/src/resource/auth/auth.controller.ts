import { Body, Controller, Post, Get, UseGuards, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from '@/resource/auth/auth.guard';
import { CookieKey } from '@/utils/const'
import * as moment from 'moment';
import { resSucFormat } from '@/interceptor/transform.interceptor'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@SkipAuth()
	@Post('login')
	async signIn(@Body() signInDto: Record<string, any>, @Response() res) {
		const result = await this.authService.signIn(signInDto.username, signInDto.password);
		// 将JWT添加到cookie中
		await res.cookie(CookieKey, result.access_token, { httpOnly: true, expires: moment().add(1, 'day').toDate() });
		return res.send(resSucFormat(result))
	}
	@Post('logout')
	async logout(@Request() req, @Response() res) {
		// 清除与用户相关的会话信息，例如 JWT token 或删除 cookie\
		const token = req.cookies[CookieKey];
		this.authService.signOut(token)
		res.clearCookie(CookieKey); // 删除指定的 cookie
		return res.send(resSucFormat('退出登录成功'))
	}
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}
}
