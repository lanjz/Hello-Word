import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import ModuleEntity from '@/resource/module/entities/module.entity'
import { TreeRepository } from 'typeorm'

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly repository: TreeRepository<ModuleEntity>,
  ) {}
  async create(createData: CreateModuleDto) {
    const { parentId, ...data } = createData
    const resetData = Object.assign(new ModuleEntity(), data)
    const parentModule = !parentId ? null : await this.repository.findOneBy({ id: parentId });
    resetData.parent = parentModule
    return this.repository.save(resetData); // 使用 insert 和update 都不会自己在闭包表建立关系，save 内部做了更多事情
  }
  sortModules(modules:ModuleEntity[]) {
    if(modules.length) {
      modules.forEach(item => {
        if(item.children) {
          item.children = this.sortModules(item.children)
        }
      })
      return modules.sort((a, b) => (b.sort || 0) - (a.sort || 0))
    }
    return modules
  }
  async findAll() {
    const ms = await this.repository.findTrees();
    return this.sortModules(ms);
  }
  async findAllByChild(id) {
    const data = await this.findOne(id)
    return this.repository.findAncestors(data);
  }
  async findAllByParent(id) {
    const data = await this.findOne(id)
    return this.repository.findDescendantsTree(data);
  }
  findOne(id: number) {
    return this.repository.findOne({where: {id}, relations: ['children']});
  }
  async update(id: number, updateData: UpdateModuleDto) {
    const { parentId, ...data } = updateData
    if('parentId' in updateData ){
      const parentModule = !parentId ? null : await this.repository.findOneBy({ id: parentId });
      return this.repository.save( {
        ...data,
        parent: parentModule
      });
    }
    return this.repository.save( {
      ...data,
    });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
