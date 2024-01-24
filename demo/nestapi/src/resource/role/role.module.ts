import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import RoleEntity from '@/resource/role/entities/role.entity'
import ModuleEntity from '@/resource/module/entities/module.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), TypeOrmModule.forFeature([ModuleEntity])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
