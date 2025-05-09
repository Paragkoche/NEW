import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Mash } from '../../mash/enitity/mash.enitity';

@Entity()
export class MashVariants {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Mash, (mash) => mash)
  mash: Mash[];
}
