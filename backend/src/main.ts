import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

const httpsOptions = {
  key: fs.readFileSync('C:\\backend\\NEW\\backend\\server.key'),
  cert: fs.readFileSync('C:\\backend\\NEW\\backend\\server.crt'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
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
  await app.listen(process.env.PORT ?? 3000);
  // const httpsServer = https
  //   .createServer(httpsOptions, server)
  //   .listen(process.env.PORT ?? 3000);
}
bootstrap();
