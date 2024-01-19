import {
  Entity,
  Column,
} from 'typeorm';
import { CommonEntity } from '@/extends/common.entity'
import { GenderEnum, RoleEnum } from '@/utils/const'

@Entity('user')
export default class User extends CommonEntity{
  @Column({name: 'alias_name'})
  aliasName: string;

  @Column()
  password: string;

  @Column({ unique: true, update: false })
  username: string;

  // 0-女  1-男
  @Column({ default: 1, type: 'enum', enum: GenderEnum })
  gender: number;

  @Column({type: 'simple-array', enum: RoleEnum})
  roles: RoleEnum[];

  // @OneToMany(() => Article, (article) => article.user)
  // articles: Article[];

/*  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;*/

/*  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    select: false,
    insert: false,
    update: false,
  }) // 添加软删除字段
  private deletedAt?: Date; // 可选类型的日期字段*/


/*
  @BeforeInsert()
  setBeforeInsert() {
    if (!this.gender) {
      this.gender = 1;
    }
  }*/
}
