import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../article/article.entity';
import { Picture } from '../picture/picture.entity';
import { PrimaryKeyType } from '@/common';

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn('increment')
  id: PrimaryKeyType;

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

  @OneToMany(() => Picture, (picture) => picture.user)
  pictures: Picture[];
}
