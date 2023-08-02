import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Banner {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  url: string;
}
