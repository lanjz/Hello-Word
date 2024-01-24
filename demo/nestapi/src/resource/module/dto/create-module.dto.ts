import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator'
import { Column } from 'typeorm'

export class CreateModuleDto {
	@IsNotEmpty()
	@Length(1, 20)
	moduleCode: string;

	@IsNotEmpty()
	@Length(1, 20)
	moduleName: string;

	@IsOptional()
	@IsBoolean()
	hidden: boolean;

	@IsOptional()
	@Length(1, 100)
	@Column({ name: 'icon' })
	icon: string

	@IsOptional()
	@IsNumber()
	sort: number;

	@IsOptional()
	@IsNumber()
	parentId: number;
}
