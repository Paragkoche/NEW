import { Module } from '@nestjs/common';
import { ProductModule } from './api/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './api/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Users } from './api/users/enititys/user.enitity';
import { Product } from './api/product/enititys/product.enitity';
import { Model } from './api/product/model/enitity/model.enitity';
import { MashVariants } from './api/product/mash-variants/enitity/mash-variants.enitity';
import * as fs from 'fs';
import { FabricRage } from './api/product/fabric-rage/enitity/fabric-rage.enitity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Mash } from './api/product/mash/enitity/mash.enitity';
import { Fabric } from './api/product/fabric/enitity/fabric.enitity';
import { Dimensions } from './api/product/dimensions/enitity/dimensions.enitity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/static/upload',
      serveStaticOptions: {
        index: false, // disables auto-loading index.html
      },
    }),

    TypeOrmModule.forRoot({
      type: 'cockroachdb',
      database: process.env.DB_DATABASE!,
      password: process.env.DB_PASSWORD!,
      port: Number(process.env.DB_PORT!),
      username: 'SOS_AR',
      host: process.env.DB_HOST!,
      ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./crt/ca.crt').toString(),
        key: fs.readFileSync('./crt/client.sos_ar.key').toString(),
        cert: fs.readFileSync('./crt/client.sos_ar.crt').toString(),
      },
      entities: [
        Users,
        Product,
        Model,
        Mash,
        MashVariants,
        Fabric,
        Dimensions,
        FabricRage,
      ],
      synchronize: true,
      // dropSchema: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '30d' },
    }),
    ProductModule,
    UsersModule,
  ],
})
export class AppModule {}
