import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  sender_id: string;

  @Column({
    nullable: false,
  })
  receiver_id: string;

  @Column({
    nullable: false,
  })
  content: string;
}
