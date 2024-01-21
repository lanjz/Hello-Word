import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm'
import { CommonEntity } from '@/extends/common.entity'

@Entity('module')
@Tree('closure-table')
export default class Module extends CommonEntity{
	@Column({ name: 'module_code', length: 20, unique: true })
	moduleCode: string

	@Column({ name: 'module_name', length: 20 })
	moduleName: string

	@Column({ name: 'hidden', default: false })
	hidden: boolean

	@Column({ name: 'icon', length: 100, nullable: true })
	icon: string

	@TreeChildren()
	children: Module[];

	@TreeParent()
	parent: Module;
}
