import { IsNotEmpty } from 'class-validator'

export class CreateRoleDto {
	id: number;

	@IsNotEmpty()
	roleCode: string;

	@IsNotEmpty()
	roleName: string;

}
