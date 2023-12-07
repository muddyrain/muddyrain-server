import { PrimaryKeyType } from '@/common';
import { PRIVATE_KEY } from './../../constant/config';
import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Comment extends CommonEntity {
  @Column({
    comment: '评论内容',
    nullable: false,
  })
  content: string;

  @Column({
    comment: '评论的文章id',
    nullable: false,
    type: 'int',
  })
  article_id: PrimaryKeyType;

  @Column({
    comment: '评论的用户id',
    nullable: false,
    type: 'int',
  })
  user_id: PrimaryKeyType;

  @Column({
    comment: '评论的父级id',
    nullable: true,
    default: 0,
    type: 'int',
  })
  parent_id: PrimaryKeyType;
}
