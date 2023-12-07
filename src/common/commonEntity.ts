import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrimaryKeyType } from '.';

@Entity()
export class CommonEntity {
  @PrimaryGeneratedColumn('increment')
  id: PrimaryKeyType;

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
