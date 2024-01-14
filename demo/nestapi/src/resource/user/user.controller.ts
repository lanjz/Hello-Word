import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { HttpStatusError } from '@/utils/httpStatus.service';
import { Roles, Role } from '@/resource/auth/role.guard'
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.admin)
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
  @Post()
  async create(@Body() createUserDto: UserDto): Promise<User> {
    const { id } = createUserDto;
    return id ? this.updateData(createUserDto) : this.createData(createUserDto);
  }
  private async createData(createUserDto: UserDto): Promise<User> {
/*    const existingUsername = await this.userService.findOneByUsername(
      createUserDto.username,
    );
    if (existingUsername) {
      HttpStatusError.fail(`${createUserDto.username}已存在`);
    }*/
    return this.userService.save(createUserDto);
  }

  private async updateData(createUserDto: UserDto): Promise<User> {
    const { id } = createUserDto;
    const existingUser = await this.userService.findOne(id);
    if (!existingUser) {
      HttpStatusError.fail(`用户${id}不存在`);
    }
    delete createUserDto.username;
    return this.userService.save(createUserDto);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
