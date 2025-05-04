import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Model } from './model.enitity';

@Entity()
export class Dimensions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column('float')
  x: number;

  @Column('float')
  y: number;

  @Column('float')
  z: number;

  @Column('float')
  end_x: number;

  @Column('float')
  end_y: number;

  @Column('float')
  end_z: number;

  @ManyToOne(() => Model, (model) => model.dimensions)
  model: Model;
}
