import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Article extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    comment: '文章标题',
  })
  title: string;

  @Column({
    nullable: true,
    comment: '文章主题',
  })
  theme: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '文章内容',
  })
  content: string;

  @ManyToOne(() => User, (user) => user.articles)
  user: User;
}
