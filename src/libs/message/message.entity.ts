import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({
  database: '',
})
export class Message extends CommonEntity {
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
