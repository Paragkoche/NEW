import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Fabric } from './fabric.enitity';

@Entity()
export class FabricRage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Fabric, (fabric) => fabric)
  fabric: Fabric[];
}
