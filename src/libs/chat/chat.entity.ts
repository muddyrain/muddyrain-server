import { PrimaryKeyType } from '@/common';
import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat extends CommonEntity {
  @PrimaryGeneratedColumn('increment')
  id: PrimaryKeyType;

  @Column({
    nullable: false,
    comment: '发送者id',
  })
  sender_id: string;

  @Column({
    nullable: false,
    comment: '接收者id',
  })
  receiver_id: string;

  @Column({
    nullable: false,
    comment: '内容',
  })
  content: string;
}
