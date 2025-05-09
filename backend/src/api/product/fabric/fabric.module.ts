import { Module } from '@nestjs/common';
import { FabricService } from './fabric.service';
import { FabricController } from './fabric.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/api/users/enititys/user.enitity';
import { Fabric } from './enitity/fabric.enitity';
import { FabricRage } from '../fabric-rage/enitity/fabric-rage.enitity';
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

    TypeOrmModule.forFeature([Users, Fabric, FabricRage]),
  ],
  controllers: [FabricController],
  providers: [FabricService],
})
export class FabricModule {}
