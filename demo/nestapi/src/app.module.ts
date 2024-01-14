import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './resource/user/user.module';
import { User } from './resource/user/entities/user.entity';
import { Article } from './resource/article/entities/article.entity';
import { ArticleModule } from './resource/article/article.module';
import { CommonController } from './resource/common/common.controller';
import { AuthModule } from '@/resource/auth/auth.module';
import { AuthGuard } from '@/resource/auth/auth.guard'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '55555yyy',
      database: 'template',
      entities: [User, Article],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    ArticleModule,
    AuthModule,
  ],
  controllers: [AppController, CommonController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AppModule {}
