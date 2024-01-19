import {
  IsNotEmpty,
  IsIn,
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

  @IsOptional() // 表示可选
  @IsArray() // 表示只能是数组
  @ArrayMinSize(0) // 允许空数据
  @ArrayNotContains([RoleEnum], {message: '无效角色'} )
  @ArrayUnique() // 不允许重复
  roles?: RoleEnum[];
}
