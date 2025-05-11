import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MashVariants } from '../../mash-variants/enitity/mash-variants.enitity';
import { FabricRage } from '../../fabric-rage/enitity/fabric-rage.enitity';
import { Model } from '../../model/enitity/model.enitity';

@Entity()
export class Mash {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  itOptional: boolean;

  @Column({ default: false })
  textureEnable: boolean;

  @Column('text', { nullable: true })
  thumbnailUrl?: string | null;

  @Column('text', { nullable: true })
  url?: string | null;

  @Column()
  name: string;

  @Column()
  mashName: string;

  @ManyToMany(() => FabricRage, (fr) => fr.mash)
  fabricRange: FabricRage[];

  @ManyToOne(() => Model, (model) => model.mash)
  model: Model;

  @ManyToOne(() => MashVariants, (mv) => mv.mash)
  mashVariants: MashVariants;
}
