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
}
