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

@Module({
  imports: [
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
