import { IsNotEmpty, IsEnum } from 'class-validator'
import { Role } from '@/utils/const'

export class CreateRoleDto {

	@IsEnum(Role, {message: '无效角色'})
	@IsNotEmpty({message: '角色编码不能为空'})
	roleCode: string;

	@IsNotEmpty({message: '角色名称不能为空'})
	roleName: string;

}
