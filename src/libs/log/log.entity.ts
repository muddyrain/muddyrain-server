import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Log extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column()
  ip: string;

  @Column()
  url: string;

  @Column()
  username: string;
}
