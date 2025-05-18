import {
  AfterRemove,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Model } from '../model/enitity/model.enitity';
import * as path from 'path';
import * as fs from 'fs/promises';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column()
  pdfText: string;

  @OneToMany(() => Model, (model) => model.product, { onDelete: 'CASCADE' })
  model: Model[];

  @AfterRemove()
  async deleteFile() {
    console.log('sss->>>>>>>>>>', this);

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
      deleteIfExists(this.pdfText),
    ]);
  }
}
