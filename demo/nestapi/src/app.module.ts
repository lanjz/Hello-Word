import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './resource/user/user.module';
import UserEntity from './resource/user/entities/user.entity';
import ArticleEntity from './resource/article/entities/article.entity';
import RoleEntity from './resource/role/entities/role.entity';
import ModuleEntity from './resource/module/entities/module.entity';
import { ArticleModule } from './resource/article/article.module';
import { CommonController } from './resource/common/common.controller';
import { AuthModule } from '@/resource/auth/auth.module';
import { AuthGuard } from '@/resource/auth/auth.guard'
import { RolesGuard } from '@/resource/auth/role.guard'
import { RoleModule } from '@/resource/role/role.module';
import { ModuleModule } from '@/resource/module/module.module';
import { CustomNamingStrategy } from './utils/helper';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '55555yyy',
      database: 'template',
      entities: [UserEntity, ArticleEntity, RoleEntity, ModuleEntity],
      synchronize: true,
      autoLoadEntities: true,
      namingStrategy: new CustomNamingStrategy(),
    }),
    UserModule,
    ArticleModule,
    AuthModule,
    RoleModule,
    ModuleModule,
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
