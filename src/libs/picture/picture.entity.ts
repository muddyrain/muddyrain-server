import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Picture extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    comment: '图片宽度',
  })
  width: number;

  @Column({
    nullable: false,
    comment: '图片高度',
  })
  height: number;

  @Column({
    nullable: false,
    comment: '图片地址',
  })
  url: number;

  @Column({
    nullable: false,
    comment: '是否为外部图片',
  })
  isExternal: boolean;

  @ManyToOne(() => User, (user) => user.pictures)
  user: User;
}
