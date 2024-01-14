import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
@Module({
	imports: [
		UserModule,
		JwtModule.register({
			global: true,
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '300s' },
		}),
	],
	providers: [
		AuthService,
/*		{
			provide: 'APP_GUARD',
			useClass: AuthGuard
		}*/
	],
	controllers: [AuthController],
})
export class AuthModule {}
