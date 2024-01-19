import { CommonEntity } from '@/extends/common.entity';
import { Column, Entity } from 'typeorm'
import { RoleEnum } from '@/utils/const'

@Entity('role')
export default class Role extends CommonEntity{
	@Column({name: 'role_code', type: 'enum',  unique: true, update: false, enum: RoleEnum })
	roleCode: string;

	@Column({name: 'role_name',  unique: true})
	roleName: string;
}
