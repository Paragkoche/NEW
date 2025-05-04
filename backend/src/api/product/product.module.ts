import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/enititys/user.enitity';
import { Product } from './enititys/product.enitity';
import { Model } from './enititys/model.enitity';
import { Mash } from './enititys/mash.enitity';
import { MashVariants } from './enititys/mash-variants.enitity';
import { Fabric } from './enititys/fabric.enitity';
import { FabricRage } from './enititys/fabric-rage.enitity';
import { Dimensions } from './enititys/dimensions.enitity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', 'upload'),
        filename: (req, file, cb) => {
          const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
    TypeOrmModule.forFeature([
      Users,
      Product,
      Model,
      Mash,
      MashVariants,
      Fabric,
      FabricRage,
      Dimensions,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
