import {
  IsNotEmpty,
  IsIn,
  IsEnum,
  ValidateIf,
  IsOptional,
  IsArray,
  ArrayNotContains,
  ArrayMinSize,
  ArrayUnique
} from 'class-validator';
import { GenderEnum, RoleEnum } from '@/utils/const'
export class CreateUserDto {
  @IsNotEmpty()
  aliasName: string;

  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @IsNotEmpty({ message: '账号不能为空' })
  username: string;

  // @ValidateIf(validateIf)
  @IsOptional()
  @IsIn(GenderEnum, {message: '性别格式不正确'} )
  gender?: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[];
}
