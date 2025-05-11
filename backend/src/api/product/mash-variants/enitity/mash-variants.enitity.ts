import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mash } from '../../mash/enitity/mash.enitity';

@Entity()
export class MashVariants {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Mash, (mash) => mash.mashVariants)
  @JoinColumn()
  mash: Mash[];
}
