import {
  BeforeRemove,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FabricRage } from '../../fabric-rage/enitity/fabric-rage.enitity';
import * as fs from 'fs/promises';
import * as path from 'path';
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

  @ManyToOne(() => FabricRage, (fr) => fr.fabric, {
    onDelete: 'CASCADE',
  })
  fabricRage: FabricRage;

  @BeforeRemove()
  async deleteFile() {
    const deleteIfExists = async (url: string | undefined) => {
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
      deleteIfExists(this.thumbnailUrl),
      deleteIfExists(this.url),
    ]);
  }
}
