import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../article/article.entity';
import { Picture } from '../picture/picture.entity';
import { PrimaryKeyType } from '@/common';
import { Comment } from '../article/Comment.entity';
import { RecentActivity } from '../recent-activity/recent-activity.entity';

enum genderEnum {
  男 = 0,
  女 = 1,
  保密 = 2,
}

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn('increment')
  id: PrimaryKeyType;

  @Column({ unique: true, comment: '用户名' })
  userName: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ nullable: true, comment: '邮箱', default: '' })
  email?: string;

  @Column({ nullable: true, comment: '头像', type: 'text' })
  avatar?: string;

  @Column({ nullable: true, comment: '手机号', default: '' })
  mobile?: string;

  @Column({ nullable: true, comment: '地址', default: '' })
  address?: string;

  @Column({
    nullable: true,
    type: 'int',
    default: genderEnum.保密,
    comment: '性别',
  })
  gender?: genderEnum;

  @Column({ nullable: true, comment: '生日' })
  birthday?: string;

  @Column({ nullable: true, comment: '昵称', default: '' })
  nickName?: string;

  @Column({ nullable: true, comment: '个人简介', default: '' })
  description?: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Picture, (picture) => picture.user)
  pictures: Picture[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => RecentActivity, (recentActivities) => recentActivities.user)
  recentActivities: RecentActivity[];
}
