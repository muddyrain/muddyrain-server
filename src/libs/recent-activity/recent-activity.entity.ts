import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

export enum RecentActivityType {
  // 注册
  register = 0,
  // 登录
  login = 1,
  // 发布文章
  publishArticle = 2,
}

@Entity()
export class RecentActivity extends CommonEntity {
  @Column({
    comment: '活动类型',
    type: 'int',
  })
  type: RecentActivityType;

  @Column({
    comment: '活动内容',
    type: 'text',
  })
  content: string;

  @ManyToOne(() => User, (user) => user.recentActivities)
  user: User;
}
