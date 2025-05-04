import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from './model.enitity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column()
  pdfText: string;

  @OneToMany(() => Model, (model) => model.product)
  model: Model[];
}
