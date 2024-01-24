import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import RoleEntity from './entities/role.entity'
import ModuleEntity from '../module/entities/module.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository} from 'typeorm'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: Repository<RoleEntity>,
    @InjectRepository(ModuleEntity)
    private moduleRepository: Repository<ModuleEntity>,
  ) {}
  insert(createRDto: CreateRoleDto) {
    // 第二种触发 entity->beforeUpdate 钩子的方法
    // const entity = plainToClass(Role, createRDto);
    return this.repository.insert(Object.assign(new RoleEntity(), createRDto))
  }
  async update(updateDto: UpdateRoleDto) {
    const { moduleIds, ...roleInfo } = updateDto;
    if(moduleIds && moduleIds.length) {
      roleInfo.modules = await this.moduleRepository.findByIds(moduleIds);
    }
    return this.repository.save(roleInfo);
  }
  async findAll() {
    const [ list, total ] = await this.repository.findAndCount()
    return {
      list,
      total,
    };
  }
  findOne(id: number): Promise<RoleEntity> {
    return this.repository.findOne({ where: {id}, relations: ['modules']});
  }
  remove(id: number | number[]) {
    return this.repository.delete(id)
  }
  async findRoleModule(id: number): Promise<ModuleEntity[]> {
    const role = await this.findOne(id)
    const leafNodes = role.modules || []
    const treeNodes = new Map<number, ModuleEntity>()
    const hasParentNodes = new Set<ModuleEntity>()

    for (const leaf of leafNodes) {
      await this.addNodeAndAncestors(leaf, treeNodes, hasParentNodes); // 为每个叶子节点添加它的所有祖先
    }
    const rootModules = Array.from(treeNodes.values()).filter(node => !hasParentNodes.has(node));
    return rootModules;
  }
  async addNodeAndAncestors(node: ModuleEntity, nodeMap: Map<number,ModuleEntity>, hasParentNodes:Set<ModuleEntity>): Promise<void> {
    nodeMap.set(node.id, node);
    const parent = await this.getParentNode(node); // 获取父节点
    if (parent) {
      if (!nodeMap.has(parent.id)) {
        await this.addNodeAndAncestors(parent, nodeMap, hasParentNodes);
      }
      // 将当前节点添加到父节点的 children 数组中
      parent.children = parent.children || [];
      parent.children.push(node);
      hasParentNodes.add(node)
    }
  }
  async getParentNode(node: any): Promise<ModuleEntity|null> {
    const findModule = await this.moduleRepository.findOne( {where: {id: node.id},  relations: ['parent'] });
    return findModule.parent || null
  }
}
