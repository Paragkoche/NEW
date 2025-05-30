import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Fabric } from '../../fabric/enitity/fabric.enitity';
import { Mash } from '../../mash/enitity/mash.enitity';

@Entity()
export class FabricRage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Fabric, (fabric) => fabric.fabricRage, {
    onDelete: 'CASCADE',
  })
  fabric: Fabric[];
  @ManyToMany(() => Mash, (mash) => mash.fabricRange, {
    onDelete: 'CASCADE',
  })
  mash: Mash;
}
