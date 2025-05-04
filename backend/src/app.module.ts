import { Module } from '@nestjs/common';
import { ProductModule } from './api/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './api/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Users } from './api/users/enititys/user.enitity';
import { Product } from './api/product/enititys/product.enitity';
import { Model } from './api/product/enititys/model.enitity';
import { Mash } from './api/product/enititys/mash.enitity';
import { MashVariants } from './api/product/enititys/mash-variants.enitity';
import { Fabric } from './api/product/enititys/fabric.enitity';
import { Dimensions } from './api/product/enititys/dimensions.enitity';
import { FabricRage } from './api/product/enititys/fabric-rage.enitity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
      type: 'sqlite',
      database: 'database.db',
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
