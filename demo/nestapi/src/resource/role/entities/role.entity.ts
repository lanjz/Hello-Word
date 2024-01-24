import { CommonEntity } from '@/extends/common.entity';
import { Column, Entity, ManyToMany, JoinTable } from 'typeorm'
import { RoleEnum } from '@/utils/const'
import Module from '../../module/entities/module.entity'

@Entity('role')
export default class Role extends CommonEntity{
	@Column({name: 'role_code', type: 'enum',  unique: true, update: false, enum: RoleEnum })
	roleCode: string;

	@Column({name: 'role_name',  unique: true})
	roleName: string;

	@ManyToMany(() => Module)
	@JoinTable()
	modules: Module[];
}
