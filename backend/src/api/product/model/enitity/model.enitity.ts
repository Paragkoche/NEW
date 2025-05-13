import {
  BeforeRemove,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mash } from '../../mash/enitity/mash.enitity';
import { Dimensions } from '../../dimensions/enitity/dimensions.enitity';
import { Product } from '../../enititys/product.enitity';
import * as fs from 'fs/promises';
import * as path from 'path';
@Entity()
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column({ default: '' })
  imageBank: string;
  @Column()
  isDefault: boolean;

  @Column()
  shadow: boolean;

  @Column()
  autoRotate: boolean;

  @Column()
  RotationSpeed: number;

  @Column({ nullable: true })
  url: string;

  @Column('text', { nullable: true })
  thumbnailUrl?: string | null;

  @OneToMany(() => Mash, (mash) => mash.model, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  mash: Mash[];

  @OneToMany(() => Dimensions, (dimensions) => dimensions.model, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  dimensions: Dimensions[];

  @ManyToOne(() => Product, (product) => product.model, { onDelete: 'CASCADE' })
  product: Product;

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

    // Delete files associated with the model
    await Promise.all([
      deleteIfExists(this.thumbnailUrl),
      deleteIfExists(this.url),
    ]);

    // Delete files associated with connected Mash entities
    if (this.mash) {
      for (const mash of this.mash) {
        await deleteIfExists(mash.url);
        await deleteIfExists(mash.thumbnailUrl);
        if (mash.mashVariants) {
          for (const variant of mash.mashVariants.mash) {
            await deleteIfExists(variant.url);
            await deleteIfExists(variant.thumbnailUrl);
          }
        }
      }
    }
  }
}
