import { PartialType } from '@nestjs/mapped-types'
import { CreateRoleDto } from './create-role.dto'
import { ArrayUnique, IsArray, IsNotEmpty, IsOptional } from 'class-validator'
import moduleEntity from '../../module/entities/module.entity'

export class UpdateRoleDto extends PartialType(CreateRoleDto){
	@IsNotEmpty({message: 'id不能为空'})
	id: number;

	@IsOptional()
	@IsArray()
	@ArrayUnique()
	moduleIds: number[];

	@IsOptional()
	@IsArray()
	modules: moduleEntity[];
}
