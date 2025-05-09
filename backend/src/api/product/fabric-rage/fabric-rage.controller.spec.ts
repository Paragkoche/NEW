import { Test, TestingModule } from '@nestjs/testing';
import { FabricRageController } from './fabric-rage.controller';
import { FabricRageService } from './fabric-rage.service';

describe('FabricRageController', () => {
  let controller: FabricRageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FabricRageController],
      providers: [FabricRageService],
    }).compile();

    controller = module.get<FabricRageController>(FabricRageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
