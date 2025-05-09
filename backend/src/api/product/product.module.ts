import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/enititys/user.enitity';
import { Product } from './enititys/product.enitity';
import { Model } from './model/enitity/model.enitity';

import { MashVariants } from './mash-variants/enitity/mash-variants.enitity';

import { FabricRage } from './fabric-rage/enitity/fabric-rage.enitity';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { ModelModule } from './model/model.module';
import { DimensionsModule } from './dimensions/dimensions.module';
import { FabricRageModule } from './fabric-rage/fabric-rage.module';
import { FabricModule } from './fabric/fabric.module';
import { MashModule } from './mash/mash.module';
import { MashVariantsModule } from './mash-variants/mash-variants.module';
import { Mash } from './mash/enitity/mash.enitity';
import { Fabric } from './fabric/enitity/fabric.enitity';
import { Dimensions } from './dimensions/enitity/dimensions.enitity';

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
    ModelModule,
    DimensionsModule,
    FabricRageModule,
    FabricModule,
    MashModule,
    MashVariantsModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
