import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository} from 'typeorm'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}
  insert(createRDto: CreateRoleDto) {
    // 第二种触发 entity->beforeUpdate 钩子的方法
    // const entity = plainToClass(Role, createRDto);
    return this.repository.insert(Object.assign(new Role(), createRDto))
  }
  update(id: number, updateDto: UpdateRoleDto) {
    return this.repository.update(id, updateDto);
  }
  async findAll() {
    const [ list, total ] = await this.repository.findAndCount()
    return {
      list,
      total,
    };
  }
  findOne(id: number): Promise<Role> {
    return this.repository.findOneBy({ id });
  }
  remove(id: number | number[]) {
    return this.repository.delete(id)
  }
}
