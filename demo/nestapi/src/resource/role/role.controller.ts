import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity'
import { HttpStatusError } from '@/utils/httpStatus.service'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  create(@Body() createDto: CreateRoleDto) {
    return this.roleService.insert(createDto);
  }
  @Post('update')
  async update(@Body() updateDto: UpdateRoleDto) {
    const { id } = updateDto;
    return this.roleService.update(id, updateDto);
  }
  @Get()
  findAll() {
    return this.roleService.findAll();
  }
  @Delete('delete')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
