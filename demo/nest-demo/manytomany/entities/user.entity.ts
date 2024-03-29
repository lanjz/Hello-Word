import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { CommonEntity } from 'demo/nestapi/src/extends/common.entity'
import ArticleEntity from 'demo/nestapi/src/resource/article/entities/article.entity';
import RoleEntity from 'demo/nestapi/src/resource/role/entities/role.entity'
import NoteEntity from '../../note/entities/note.entity'
import { GenderEnum } from 'demo/nestapi/src/utils/const'

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

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];

  @OneToMany(() => NoteEntity, (note) => note.users)
  notes: NoteEntity[];

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
