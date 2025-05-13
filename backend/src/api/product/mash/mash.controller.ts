import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MashService } from './mash.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import MashCreteDTO from './dto/create.dto';

@Controller('product/mash')
export class MashController {
  constructor(private readonly mashService: MashService) {}
  @ApiBearerAuth()
  @Post('create-mash')
  @UseGuards(AuthGuard)
  createMash(@Body() data: MashCreteDTO) {
    return this.mashService.createMash(data);
  }

  @ApiBearerAuth()
  @Post('update-mash/:id')
  @UseGuards(AuthGuard)
  updateMash(@Body('id') id: number, @Body() data: MashCreteDTO) {
    return this.mashService.updateMash(id, data);
  }

  @ApiBearerAuth()
  @Post('delete-mash/:id')
  @UseGuards(AuthGuard)
  deleteMash(@Body('id') id: number) {
    return this.mashService.deleteMash(id);
  }
}
