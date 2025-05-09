import { Module } from '@nestjs/common';
import { FabricRageService } from './fabric-rage.service';
import { FabricRageController } from './fabric-rage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/api/users/enititys/user.enitity';
import { Fabric } from '../fabric/enitity/fabric.enitity';
import { FabricRage } from './enitity/fabric-rage.enitity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Fabric, FabricRage])],
  controllers: [FabricRageController],
  providers: [FabricRageService],
})
export class FabricRageModule {}
