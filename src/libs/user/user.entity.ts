import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../article/article.entity';

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

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];
}
