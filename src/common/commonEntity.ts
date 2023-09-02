import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class CommonEntity {
  @CreateDateColumn({
    name: 'create_time',
    type: 'timestamp',
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    type: 'timestamp',
  })
  updateTime: Date;

  @Column({
    default: false,
  })
  isDelete: boolean;
}
