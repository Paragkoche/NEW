import {
  BeforeRemove,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MashVariants } from '../../mash-variants/enitity/mash-variants.enitity';
import { FabricRage } from '../../fabric-rage/enitity/fabric-rage.enitity';
import { Model } from '../../model/enitity/model.enitity';
import * as fs from 'fs/promises';
import * as path from 'path';
@Entity()
export class Mash {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @ManyToMany(() => FabricRage, (fr) => fr.mash, { onDelete: 'CASCADE' })
  @JoinTable()
  fabricRange: FabricRage[];

  @ManyToOne(() => Model, (model) => model.mash, { onDelete: 'CASCADE' })
  model: Model;

  @ManyToOne(() => MashVariants, (mv) => mv.mash, { onDelete: 'CASCADE' })
  mashVariants: MashVariants;

  @BeforeRemove()
  async deleteFile() {
    const deleteIfExists = async (url: string | undefined | null) => {
      if (!url) return;

      try {
        const relativePath = url.replace('/static', '');
        console.log(relativePath, __dirname);

        const fullPath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          '..',

          relativePath,
        );
        console.log(fullPath);

        await fs.unlink(fullPath);
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          console.error(`Error deleting file at ${url}:`, err);
        }
      }
    };
    await Promise.all([
      deleteIfExists(this.url),
      deleteIfExists(this.thumbnailUrl),
    ]);
  }
}
