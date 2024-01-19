import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import RoleEntity from 'demo/nestapi/src/resource/role/entities/role.entity'
import UserEntity from './entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TypeOrmModule.forFeature([RoleEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
