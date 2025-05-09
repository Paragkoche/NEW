import { Controller } from '@nestjs/common';
import { MashVariantsService } from './mash-variants.service';

@Controller('product/mash-variants')
export class MashVariantsController {
  constructor(private readonly mashVariantsService: MashVariantsService) {}
}
