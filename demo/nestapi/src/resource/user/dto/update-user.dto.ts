import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(UserDto) {
  @IsNotEmpty()
  aliasName?: string;
  @IsNotEmpty()
  password?: string;
  @IsIn([1, 2])
  gender?: number;
  // @IsNotEmpty()
  // isActive?: number;
}
