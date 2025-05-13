import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ModelService } from './model.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ModelCreateDto } from './dto/create.dto';

@Controller('product/model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Get('get-all-model')
  getAllModel() {
    return this.modelService.getAllModel();
  }

  @Get('get-model/:ProductId')
  getAllByIdModel(@Param('ProductId') id: number) {
    return this.modelService.getAllByIdModel(id);
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
        imageBank: { type: 'string' },
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
    console.log(data, file);

    return this.modelService.createModel(
      data,
      `/static/upload/${file.filename}`,
    );
  }

  @Get('get-model-by-id/:id')
  getModelById(@Param('id') id: number) {
    return this.modelService.getModelById(id);
  }

  @Put('update-model/:id')
  updateModel(@Param('id') id: number, @Body() data: ModelCreateDto) {
    return this.modelService.updateModel(id, data);
  }

  @Post('delete-model/:id')
  deleteModel(@Param('id') id: number) {
    return this.modelService.deleteModel(id);
  }
}
