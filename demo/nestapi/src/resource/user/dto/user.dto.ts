import { IsNotEmpty, IsIn, ValidateIf } from 'class-validator';
import { validateIf } from '@/utils';
export class UserDto {
  id: number;
  @IsNotEmpty()
  aliasName: string;
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
  @IsNotEmpty()
  username: string;
  @ValidateIf(validateIf)
  @IsIn([1, 2])
  gender?: number;
  @ValidateIf(validateIf)
  @IsNotEmpty()
  isActive?: boolean;
}
