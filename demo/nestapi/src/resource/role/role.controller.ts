import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

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

  @Post('delete')
  remove(@Body() body: Record<'id', number | number[]>) {
    return this.roleService.remove(body.id);
  }
}
