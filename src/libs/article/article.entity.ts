import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { PrimaryKeyType } from '@/common';

export enum ArticleTag {
  '前端',
  '后端',
  '移动端',
  '数据库',
  '服务器',
  '人工智能',
  '开发工具',
  '代码人生',
}
@Entity()
export class Article extends CommonEntity {
  @PrimaryGeneratedColumn('increment')
  id: PrimaryKeyType;

  @Column({
    nullable: false,
    comment: '文章标题',
  })
  title: string;

  @Column({
    nullable: true,
    comment: '文章主题',
    default: 'juejin',
  })
  theme: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: '文章内容',
  })
  content: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: '简要内容',
  })
  brief_content: string;

  @Column({
    comment: '文章标签',
    type: 'int',
    nullable: false,
  })
  tag: ArticleTag;

  @Column({
    nullable: true,
    comment: '文章封面',
    type: 'text',
  })
  cover: string;

  @Column({
    nullable: false,
    comment: '预览次数',
    default: 0,
  })
  preview: number;

  @ManyToOne(() => User, (user) => user.articles)
  user: User;

  @Column({
    nullable: false,
    comment: '点赞次数',
    default: 0,
  })
  like: number;
}
