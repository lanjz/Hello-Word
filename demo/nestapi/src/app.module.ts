import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './resource/user/user.module';
import { UserEntity } from './resource/user/entities/user.entity';
import ArticleEntity from './resource/article/entities/article.entity';
import RoleEntity from './resource/role/entities/role.entity';
import { ArticleModule } from './resource/article/article.module';
import { CommonController } from './resource/common/common.controller';
import { AuthModule } from '@/resource/auth/auth.module';
import { AuthGuard } from '@/resource/auth/auth.guard'
import { RolesGuard } from '@/resource/auth/role.guard'
import { RoleModule } from '@/resource/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '55555yyy',
      database: 'template',
      entities: [UserEntity, ArticleEntity, RoleEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    ArticleModule,
    AuthModule,
    RoleModule,
  ],
  controllers: [AppController, CommonController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})
export class AppModule {}
