import { Controller, Get, Post, Body, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles, RoleEnum } from '@/resource/auth/role.guard'
import { UpdateResultInterceptor } from '@/interceptor/transform.interceptor'
import { UpdateUserDto } from '@/resource/user/dto/update-user.dto'
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(RoleEnum.admin)
  findAll() {
    return this.userService.findAll();
  }
  @Post('list')
  findList(@Body() userDto) {
    return this.userService.findList(userDto);
  }
  @Post('delete')
  remove(@Body() userId: Record<'id', number | number[]>) {
    return this.userService.remove(userId.id);
  }
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.insert(createUserDto);
  }
  @Post('update')
  @UseInterceptors(UpdateResultInterceptor)
  update(@Body() updateUser: UpdateUserDto){
    const { id } = updateUser;
    return this.userService.update(id, updateUser);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
/*  private async createData(createUserDto: CreateUserDto): Promise<User> {
    const existingUsername = await this.userService.findOneByUsername(
      createUserDto.username,
    );
    if (existingUsername) {
      HttpStatusError.fail(`${createUserDto.username}已存在`);
    }
    return this.userService.save(createUserDto);
  }*/
}
