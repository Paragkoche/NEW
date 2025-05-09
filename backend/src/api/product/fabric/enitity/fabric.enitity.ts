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
    try {
      if (this.url) {
        const fullPath = path.resolve(this.url);
        await fs.unlink(fullPath);
      }
      if (this.thumbnailUrl) {
        const fullThumbPath = path.resolve(this.thumbnailUrl);
        await fs.unlink(fullThumbPath);
      }
    } catch (err) {
      console.error('Error deleting files:', err);
    }
  }
}
