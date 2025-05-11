import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mash } from '../../mash/enitity/mash.enitity';
import { Dimensions } from '../../dimensions/enitity/dimensions.enitity';
import { Product } from '../../enititys/product.enitity';

@Entity()
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column({ default: '' })
  imageBank: string;
  @Column()
  isDefault: boolean;

  @Column()
  shadow: boolean;

  @Column()
  autoRotate: boolean;

  @Column()
  RotationSpeed: number;

  @Column({ nullable: true })
  url: string;

  @Column('text', { nullable: true })
  thumbnailUrl?: string | null;
  @OneToMany(() => Mash, (mash) => mash.model)
  mash: Mash[];

  @OneToMany(() => Dimensions, (dimensions) => dimensions.model)
  dimensions: Dimensions[];

  @ManyToOne(() => Product, (product) => product.model)
  product: Product;
}
