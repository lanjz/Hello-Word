import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { HttpStatusError } from '@/utils/httpStatus.service';

@Controller('module')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post('create')
  async create(@Body() createModuleDto: CreateModuleDto) {
    return this.moduleService.create(createModuleDto);
  }

  @Get()
  findAll() {
    return this.moduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }
  @Get('/findParents/:id')
  findParents(@Param('id') id: string) {
    return this.moduleService.findAllByChild(id);
  }
  @Post('update')
  update(@Body() updateModule: UpdateModuleDto){
    const { id } = updateModule;
    return this.moduleService.update(id, updateModule);
  }

  @Post('delete')
  async remove(@Body() body: UpdateModuleDto) {
    const findRes = await this.moduleService.findOne(body.id)
    if(findRes.children.length) {
      HttpStatusError.fail(`存在子模块不可删除`);
    }
    return this.moduleService.remove(body.id);
  }
}
