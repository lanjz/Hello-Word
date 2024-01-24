import { Body, Controller, Post, Get, UseGuards, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from '@/resource/auth/auth.guard';
import { CookieKey } from '@/utils/const'
import * as moment from 'moment';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@SkipAuth()
	@Post('login')
	async signIn(@Body() signInDto: Record<string, any>, @Response() res) {
		const result = await this.authService.signIn(signInDto.username, signInDto.password);
		// 将JWT添加到cookie中
		res.cookie(CookieKey, result.access_token, { httpOnly: true, expires: moment().add(1, 'day').toDate() });
		return result;
	}

	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}
}
