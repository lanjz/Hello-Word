import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  DeleteDateColumn,
  BeforeUpdate,
} from 'typeorm';
import { CommonEntity } from '../../../extends/common.entity'
import { Article } from '../../article/entities/article.entity';

@Entity()
export class User extends CommonEntity{
  @Column({name: 'alias_name'})
  aliasName: string;

  @Column()
  password: string;

  @Column({unique: true})
  username: string;

  // 0-女  1-男
  @Column({ default: 1, type: 'enum', enum: [0, 1] })
  gender: number;

  @Column({ default: 'visitor', type: 'enum', enum: ['root', 'admin', 'Teacher', 'visitor'] })
  role: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

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
