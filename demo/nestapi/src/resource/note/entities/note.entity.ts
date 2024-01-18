import { CommonEntity } from '@/extends/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm'
import UserEntity from '../../user/entities/user.entity'

@Entity('note')
export default class NOte extends CommonEntity{
	@Column({name: 'title'})
	roleCode: string;

	@Column({name: 'content'})
	roleName: string;

	@ManyToOne(() => UserEntity, (user) => user.notes)
	users: UserEntity[]
}
