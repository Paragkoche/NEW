import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { DimensionsService } from './dimensions.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { dimensionsCreateDto } from './dto/create.dto';

@Controller('product/dimensions')
export class DimensionsController {
  constructor(private readonly dimensionsService: DimensionsService) {}
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBody({
    type: [dimensionsCreateDto],
  })
  createDimensions(@Body() data: dimensionsCreateDto[]) {
    return this.dimensionsService.createDimensions(data);
  }
}
