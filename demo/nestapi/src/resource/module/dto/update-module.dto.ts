import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleDto } from './create-module.dto';
import { IsNotEmpty } from 'class-validator'

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
	@IsNotEmpty({message: 'id不能为空'})
	id: string;
}
