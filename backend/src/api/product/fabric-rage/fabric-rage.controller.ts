import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FabricRageService } from './fabric-rage.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { createFabricRage } from './dto/create.dto';
import { UpdateFabricRage } from './dto/update.dto';

@Controller('product/fabric-rage')
export class FabricRageController {
  constructor(private readonly fabricRageService: FabricRageService) {}

  @Get('')
  getAllFabricRage() {
    return this.fabricRageService.getAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('create')
  createFabricRage(@Body() data: createFabricRage) {
    return this.fabricRageService.createFabricRage(data);
  }

  @Get('get-fabric-by-id/:id')
  async getByIdFabricRage(@Param('id') id: number) {
    return await this.fabricRageService.getById(id);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('update-fabric-by-id/:id')
  async updateByIdFabricRage(
    @Param('id') id: number,
    @Body() data: UpdateFabricRage,
  ) {
    return await this.fabricRageService.update(id, data);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('delete-fabric-by-id/:id')
  async deleteByIdFabricRage(@Param('id') id: number) {
    return await this.fabricRageService.deleteFun(id);
  }
}
