import { PrimaryKeyType } from '@/common';
import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Article } from './article.entity';

@Entity()
export class Comment extends CommonEntity {
  @Column({
    comment: '评论内容',
    nullable: false,
  })
  content: string;

  @ManyToOne(() => Article, (article) => article.comment)
  article: Article;

  @ManyToOne(() => User, (user) => user.articles)
  user: User;

  @Column({
    comment: '回复的回复id',
    default: 0,
    nullable: false,
    type: 'int',
  })
  reply_to_reply_id: PrimaryKeyType;

  @Column({
    comment: '回复id',
    default: 0,
    nullable: false,
    type: 'int',
  })
  reply_id: PrimaryKeyType;

  @Column({
    nullable: false,
    comment: '点赞次数',
    default: 0,
  })
  like: number;
}
