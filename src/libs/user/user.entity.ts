import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  mobile?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  birthday?: string;

  @Column({ nullable: true })
  nickName?: string;
}
