import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FabricRage } from './fabric-rage.enitity';

@Entity()
export class Fabric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  size: number;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @ManyToOne(() => FabricRage, (fr) => fr.fabric)
  fabricRage: FabricRage;
}
