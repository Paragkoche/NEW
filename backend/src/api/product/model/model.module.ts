import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/api/users/enititys/user.enitity';
import { Product } from '../enititys/product.enitity';
import { Model } from './enitity/model.enitity';
import { Mash } from '../mash/enitity/mash.enitity';
import { MashVariants } from '../mash-variants/enitity/mash-variants.enitity';
import { Fabric } from '../fabric/enitity/fabric.enitity';
import { FabricRage } from '../fabric-rage/enitity/fabric-rage.enitity';
import { Dimensions } from '../dimensions/enitity/dimensions.enitity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', '..', 'upload'),
        filename: (req, file, cb) => {
          const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
    TypeOrmModule.forFeature([
      Product,

      Model,
      Users,

      Mash,
      MashVariants,
      Fabric,
      FabricRage,
      Dimensions,
    ]),
  ],
  controllers: [ModelController],
  providers: [ModelService],
})
export class ModelModule {}
