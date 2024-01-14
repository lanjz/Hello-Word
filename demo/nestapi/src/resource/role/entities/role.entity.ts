import { CommonEntity } from '@/extends/common.entity';
import { Column, Entity, ManyToMany } from 'typeorm'
import { User } from '../../user/entities/user.entity'

@Entity()
export class Role extends CommonEntity{
	@Column({name: 'role_code', unique: true, update: false})
	roleCode: string;

	@Column({name: 'role_name',  unique: true})
	roleName: string;

	@ManyToMany(() => User, (user) => user.roles)
	users: User[]
}
