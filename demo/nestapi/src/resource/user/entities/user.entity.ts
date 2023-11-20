import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  DeleteDateColumn,
  BeforeUpdate,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aliasName: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ default: 1 })
  gender: number;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;
  @Column({
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
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    select: false,
    insert: false,
    update: false,
  }) // 添加软删除字段
  private deletedAt?: Date; // 可选类型的日期字段
  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @BeforeInsert()
  setBeforeInsert() {
    if (!this.gender) {
      this.gender = 1;
    }
    if (typeof this.isActive !== 'boolean') {
      this.isActive = true;
    }
  }
  @BeforeUpdate()
  setBeforeUpdate() {
    delete this.deletedAt;
  }
}
