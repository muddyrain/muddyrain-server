import { PrimaryKeyType } from '@/common';
import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Log extends CommonEntity {
  @PrimaryGeneratedColumn('increment')
  id: PrimaryKeyType;

  @Column({
    type: 'text',
  })
  message: string;

  @Column()
  ip: string;

  @Column()
  url: string;

  @Column()
  username: string;
}
