import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Fabric } from '../../fabric/enitity/fabric.enitity';
import { Mash } from '../../mash/enitity/mash.enitity';

@Entity()
export class FabricRage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Fabric, (fabric) => fabric.fabricRage, {
    onDelete: 'CASCADE',
  })
  fabric: Fabric[];
  @ManyToOne(() => Mash, (mash) => mash.fabricRange)
  mash: Mash;
}
