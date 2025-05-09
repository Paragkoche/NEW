import { Module } from '@nestjs/common';
import { DimensionsService } from './dimensions.service';
import { DimensionsController } from './dimensions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/api/users/enititys/user.enitity';
import { Dimensions } from './enitity/dimensions.enitity';
import { Model } from '../model/enitity/model.enitity';

@Module({
  imports: [TypeOrmModule.forFeature([Dimensions, Model, Users])],
  controllers: [DimensionsController],
  providers: [DimensionsService],
})
export class DimensionsModule {}
