import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Article extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.articles)
  user: User;
}
