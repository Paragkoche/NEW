import { Module } from '@nestjs/common';
import { MashVariantsService } from './mash-variants.service';
import { MashVariantsController } from './mash-variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/api/users/enititys/user.enitity';
import { Product } from '../enititys/product.enitity';

import { Mash } from '../mash/enitity/mash.enitity';
import { MashVariants } from '../mash-variants/enitity/mash-variants.enitity';
import { Fabric } from '../fabric/enitity/fabric.enitity';
import { FabricRage } from '../fabric-rage/enitity/fabric-rage.enitity';
import { Dimensions } from '../dimensions/enitity/dimensions.enitity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Product,
      Mash,
      MashVariants,
      Fabric,
      FabricRage,
      Dimensions,
    ]),
  ],
  controllers: [MashVariantsController],
  providers: [MashVariantsService],
})
export class MashVariantsModule {}
