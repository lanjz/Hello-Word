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
    return this.repository.insert(resetData);
  }

  findAll() {
    return this.repository.findTrees();
  }
  async findAllByChild(id) {
    const data = await this.findOne(id)
    return this.repository.findAncestors(data);
  }
  findOne(id: string) {
    return this.repository.findOne({where: {id}, relations: ['children']});
  }
  async update(id: string, updateData: UpdateModuleDto) {
    const { parentId, ...data } = updateData
    const parentModule = !parentId ? null : await this.repository.findOneBy({ id: parentId });
    return this.repository.update(id, {
      ...data,
      parent: parentModule
    });
  }

  remove(id: string) {
    return this.repository.delete(id);
  }
}
