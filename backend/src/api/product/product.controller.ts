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
import { ModelCreateDto } from './dto/Model/create.dto';
import { dimensionsCreateDto } from './dto/dimensions/create.dto';
import { createFabricRage } from './dto/fabric-rage/create.dto';
import { CreateFabricDTO } from './dto/fabric/create.dto';
import MashCreteDTO from './dto/Mash/create.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('get-all')
  getAllProduct() {
    return this.productService.getAllProduct();
  }

  @Get('model/:ProductId')
  getAllModel(@Param('ProductId') id: number) {
    return this.productService.getAllModel(id);
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
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('model', {
      fileFilter: (req, file, cb) => {
        const allowedTypes = /\.(glb|obj)$/i;
        if (!file.originalname.match(allowedTypes)) {
          return cb(
            new UnprocessableEntityException(
              'Only .glb and .obj files are allowed!',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'number' },
        name: { type: 'string' },
        isDefault: { type: 'boolean' },
        shadow: { type: 'boolean' },
        autoRotate: { type: 'boolean' },
        RotationSpeed: { type: 'number' },
        model: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('create-model')
  createModel(
    @Body() data: ModelCreateDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.productService.createModel(
      data,
      `/static/upload/${file.filename}`,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('create-dimensions')
  @ApiBody({
    type: [dimensionsCreateDto],
  })
  createDimensions(@Body() data: dimensionsCreateDto[]) {
    return this.productService.createDimensions(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('create-fabric-rage')
  createFabricRage(@Body() data: createFabricRage) {
    return this.productService.createFabricRage(data);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'fabric', maxCount: 1 },
    ]),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        FabricRageId: { type: 'number' },
        name: { type: 'string' },
        size: { type: 'number' },
        thumbnail: {
          type: 'string',
          format: 'binary',
        },
        fabric: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('create-fabric')
  createFabric(
    @Body() data: CreateFabricDTO,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      fabric?: Express.Multer.File[];
    },
  ) {
    return this.productService.createFabric(
      data,

      files.fabric?.length != 0 && files.fabric
        ? `/static/upload/${files.fabric[0].filename}`
        : undefined,
      files.thumbnail?.length != 0 && files.thumbnail
        ? `/static/upload/${files.thumbnail[0].filename}`
        : undefined,
    );
  }

  @ApiBearerAuth()
  @Post('create-mash')
  @UseGuards(AuthGuard)
  createMash(@Body() data: MashCreteDTO) {
    return this.productService.createMash(data);
  }

  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('mash-file', {
      fileFilter: (req, file, cb) => {
        const allowedTypes = /\.(glb|obj)$/i;
        if (!file.originalname.match(allowedTypes)) {
          return cb(
            new UnprocessableEntityException(
              'Only .glb and .obj files are allowed!',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
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
