import { PartialType } from '@nestjs/mapped-types'
import { CreateRoleDto } from './create-role.dto'
import { IsNotEmpty } from 'class-validator'

export class UpdateRoleDto extends PartialType(CreateRoleDto){
	@IsNotEmpty({message: 'id不能为空'})
	id: number;
}
