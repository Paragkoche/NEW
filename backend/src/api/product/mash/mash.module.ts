import { Module } from '@nestjs/common';
import { MashService } from './mash.service';
import { MashController } from './mash.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mash } from './enitity/mash.enitity';
import { MashVariants } from '../mash-variants/enitity/mash-variants.enitity';
import { Users } from 'src/api/users/enititys/user.enitity';
import { Fabric } from '../fabric/enitity/fabric.enitity';
import { Model } from '../model/enitity/model.enitity';
import { FabricRage } from '../fabric-rage/enitity/fabric-rage.enitity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mash,
      Model,
      MashVariants,
      Fabric,
      FabricRage,
      Users,
    ]),
  ],
  controllers: [MashController],
  providers: [MashService],
})
export class MashModule {}
