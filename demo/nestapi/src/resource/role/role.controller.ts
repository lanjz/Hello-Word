import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity'
import { HttpStatusError } from '@/utils/httpStatus.service'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    console.log('createRoleDto', createRoleDto)
    const { id } = createRoleDto;
    return id ? this.updateData(createRoleDto) : this.createData(createRoleDto);
  }
  private async createData(createUserDto: CreateRoleDto): Promise<Role> {
    return this.roleService.save(createUserDto);
  }
  private async updateData(updateRoleDto: CreateRoleDto): Promise<Role> {
    const { id } = updateRoleDto;
    const existingUser = await this.roleService.findOne(id);
    if (!existingUser) {
      HttpStatusError.fail(`角色不存在`);
    }
    return this.roleService.save(updateRoleDto);
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
