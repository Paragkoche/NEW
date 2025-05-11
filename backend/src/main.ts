import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

import * as express from 'express';
import * as https from 'https';
import { ExpressAdapter } from '@nestjs/platform-express';
const httpsOptions = {
  key: fs.readFileSync(
    'C:/backend/NEW-master (1)/NEW-master/backend/server.key',
  ),
  cert: fs.readFileSync(
    'C:/backend/NEW-master (1)/NEW-master/backend/server.crt',
  ),
};
async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('SOS Virtual configurator API')
    .setDescription('Virtual configurator API')
    .setVersion('1.0')
    .setExternalDoc('Postman Collection', '/docs-json')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
  // await app.listen(process.env.PORT ?? 3000);
  const httpsServer = https
    .createServer(httpsOptions, server)
    .listen(process.env.PORT ?? 3000);
}
bootstrap();
