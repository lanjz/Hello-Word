import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from '@/resource/auth/auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@SkipAuth()
	@Post('login')
	signIn(@Body() signInDto: Record<string, any>) {
		return this.authService.signIn(signInDto.username, signInDto.password);
	}

	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}
}
