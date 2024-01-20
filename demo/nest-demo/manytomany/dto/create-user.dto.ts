import { IsNotEmpty, IsIn, ValidateIf, IsOptional, IsArray, ArrayNotContains } from 'class-validator';
import { GenderEnum, RoleEnum } from '@/utils/const'
import { validateIf } from 'demo/nestapi/src/utils';
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
  @ArrayNotContains([RoleEnum], {message: '无效角色'} )
  roles: RoleEnum[];
}