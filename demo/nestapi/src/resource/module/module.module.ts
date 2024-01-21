import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import ModuleEntity from '@/resource/module/entities/module.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity])],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
