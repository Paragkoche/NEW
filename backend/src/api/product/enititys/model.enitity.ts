import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mash } from './mash.enitity';
import { Dimensions } from './dimensions.enitity';
import { Product } from './product.enitity';

@Entity()
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isDefault: boolean;

  @Column()
  shadow: boolean;

  @Column()
  autoRotate: boolean;

  @Column()
  RotationSpeed: number;

  @Column()
  url: string;

  @OneToMany(() => Mash, (mash) => mash.model)
  mash: Mash[];

  @OneToMany(() => Dimensions, (dimensions) => dimensions.model)
  dimensions: Dimensions[];

  @ManyToOne(() => Product, (product) => product.model)
  product: Product;
}
