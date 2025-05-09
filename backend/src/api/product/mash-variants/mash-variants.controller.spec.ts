import { Test, TestingModule } from '@nestjs/testing';
import { MashVariantsController } from './mash-variants.controller';
import { MashVariantsService } from './mash-variants.service';

describe('MashVariantsController', () => {
  let controller: MashVariantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MashVariantsController],
      providers: [MashVariantsService],
    }).compile();

    controller = module.get<MashVariantsController>(MashVariantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
