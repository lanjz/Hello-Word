import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}
  save(createRoleDto: CreateRoleDto) {
    const user = Object.assign(new Role(), CreateRoleDto);
    return this.repository.save(user);
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
  remove(id: number) {
    return this.repository.delete(id)
  }
}
