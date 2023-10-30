import { CommonEntity } from '@/common/commonEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  database: '',
})
export class Template extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  name: string;
}