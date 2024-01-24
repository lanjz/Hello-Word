import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateResultInterceptor } from '@/interceptor/transform.interceptor'
import { HttpStatusError } from '@/utils/httpStatus.service'
import { UpdateModuleDto } from '@/resource/module/dto/update-module.dto'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  create(@Body() createDto: CreateRoleDto) {
    return this.roleService.insert(createDto);
  }
  @Post('update')
  @UseInterceptors(UpdateResultInterceptor)
  async update(@Body() updateDto: UpdateRoleDto) {
    return this.roleService.update(updateDto);
  }
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get('modules')
  getRoleModules(@Query() query: UpdateModuleDto) {
    return this.roleService.findRoleModule(query.id)
  }

  @Post('delete')
  remove(@Body() body: Record<'id', number | number[]>) {
    if(body.id == 1) {
      HttpStatusError.fail(`无权限`);
    }
    return this.roleService.remove(body.id);
  }
}
