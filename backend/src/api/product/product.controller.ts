import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
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

  @Get('get-product/:id')
  getProduct(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        pdf: { type: 'string', format: 'binary' },
        thumbnail: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'pdf', maxCount: 1 },
    ]),
  )
  @Post('create-product')
  createProduct(
    @Body() data: AddProductDto,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      pdf?: Express.Multer.File[];
    },
  ) {
    let parsedData: AddProductDto;
    if (typeof data === 'string') {
      parsedData = JSON.parse(data);
    } else {
      parsedData = data;
    }
    console.log(files);

    return this.productService.createPost(
      parsedData,
      files.thumbnail
        ? `/static/upload/${files.thumbnail[0].filename}`
        : undefined,
      files.pdf ? `/static/upload/${files.pdf[0].filename}` : undefined,
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

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        pdf: { type: 'string', format: 'binary' }, // ✅ Corrected from "pdfText"
        thumbnail: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'pdf', maxCount: 1 },
    ]),
  )
  @Put('update-product/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() data: Partial<AddProductDto>,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      pdf?: Express.Multer.File[];
    },
  ) {
    console.log(data);

    return this.productService.updateProduct(
      id,
      data,
      files.thumbnail
        ? `/static/upload/${files.thumbnail[0].filename}`
        : undefined,
      files.pdf ? `/static/upload/${files.pdf[0].filename}` : undefined,
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete('delete-product/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteFun(id);
  }
}
