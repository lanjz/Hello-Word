import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, ILike } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { ListResponse } from '@/utils/Types';
import { findDataWhere } from '@/utils/index';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  save(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = Object.assign(new UserEntity(), createUserDto);
    return this.usersRepository.save(user);
  }
  insert(createUserDto: CreateUserDto) {
    return this.usersRepository.insert(Object.assign(new UserEntity(), createUserDto));
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }
  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }
  async findList(userDto: any): Promise<ListResponse<UserEntity>> {
    const where = findDataWhere(userDto, this.usersRepository);
    const [list, total] = await this.usersRepository.findAndCount(where);
    return {
      list,
      total,
      pageStart: where.skip,
      pageSize: where.take,
    };
  }
  findOne(id: number): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ id: id });
  }
  findOneByUsername(username: string): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ username });
  }
  async remove(id: number | number[]): Promise<DeleteResult> {
    // return this.usersRepository.softDelete(id); // 软删除
    return this.usersRepository.delete(id);
  }
}
