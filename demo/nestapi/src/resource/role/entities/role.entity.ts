import { CommonEntity } from '@/extends/common.entity';
import { Column, Entity, ManyToMany } from 'typeorm'
import { UserEntity } from '../../user/entities/user.entity'
import { RoleEnum } from '@/utils/const'

@Entity()
export class Role extends CommonEntity{
	@Column({name: 'role_code',  unique: true, update: false, enum: RoleEnum })
	roleCode: string;

	@Column({name: 'role_name',  unique: true})
	roleName: string;

	@ManyToMany(() => UserEntity, (user) => user.roles)
	users: UserEntity[]
}
