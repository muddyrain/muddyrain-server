import { PrimaryKeyType } from '@/common';
import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Banner extends CommonEntity {
  @PrimaryGeneratedColumn('increment')
  id: PrimaryKeyType;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  url: string;
}
