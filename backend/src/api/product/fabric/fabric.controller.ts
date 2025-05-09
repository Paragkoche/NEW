import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FabricService } from './fabric.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateFabricDTO } from './dto/create.dto';

@Controller('product/fabric')
export class FabricController {
  constructor(private readonly fabricService: FabricService) {}

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
    return this.fabricService.createFabric(
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
  @Put('update-fabric/:id')
  updateFabric(
    @Body() data: CreateFabricDTO,
    @Param('id') id: number,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      fabric?: Express.Multer.File[];
    },
  ) {
    return this.fabricService.updateFabric(
      id,
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
  @UseGuards(AuthGuard)
  @Delete('delete-fabric/:id')
  deleteFabric(@Param('id') id: number) {
    return this.fabricService.deleteFabric(id);
  }

  @Get('/get-all-fabric')
  getAllFabric() {
    return this.fabricService.getAllFabric();
  }

  @Get('/get-fabric-id/:id')
  getFabricById(@Param('id') id: number) {
    return this.fabricService.getFabricById(id);
  }
}
