import { Test, TestingModule } from '@nestjs/testing';
import { MashController } from './mash.controller';
import { MashService } from './mash.service';

describe('MashController', () => {
  let controller: MashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MashController],
      providers: [MashService],
    }).compile();

    controller = module.get<MashController>(MashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
