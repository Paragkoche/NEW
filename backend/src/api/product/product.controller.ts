import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AddProductDto } from './dto/product/create.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ModelCreateDto } from './model/dto/create.dto';
import { dimensionsCreateDto } from './dimensions/dto/create.dto';
import { createFabricRage } from './fabric-rage/dto/create.dto';
import { CreateFabricDTO } from './fabric/dto/create.dto';
import MashCreteDTO from './mash/dto/create.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('get-all')
  getAllProduct() {
    return this.productService.getAllProduct();
  }

  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        pdfText: { type: 'string' },
        thumbnail: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Post('create-product')
  createProduct(
    @Body() data: AddProductDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    let parsedData: AddProductDto;
    if (typeof data === 'string') {
      parsedData = JSON.parse(data);
    } else {
      parsedData = data;
    }

    return this.productService.createPost(
      parsedData,
      file ? `/static/upload/${file.filename}` : undefined,
    );
  }

  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-mash')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        'mash-file': {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  uploadMash(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return `/static/upload/${file.filename}`;
  }
}
