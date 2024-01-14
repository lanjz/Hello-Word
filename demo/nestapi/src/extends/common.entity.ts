import {
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn, Column,
} from 'typeorm';
export abstract class CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({
        name: 'created_at',
        insert: false,
        update: false,
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        insert: false,
        update: false,
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        insert: false,
        update: false,
        nullable: true,
        select: false,
    })
    deletedAt: Date

    @Column({ default: 1, type: 'enum', enum: [0, 1] })
    status: number;
}