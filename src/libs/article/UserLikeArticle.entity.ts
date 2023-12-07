import { PrimaryKeyType } from '@/common';
import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserLikeArticle extends CommonEntity {
  @PrimaryGeneratedColumn('increment')
  id: PrimaryKeyType;

  @Column({
    comment: '用户id',
    type: 'int',
  })
  userId: PrimaryKeyType;

  @Column({
    comment: '文章id',
    type: 'int',
  })
  articleId: PrimaryKeyType;
}
