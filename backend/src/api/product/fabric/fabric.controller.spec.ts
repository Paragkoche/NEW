import { Test, TestingModule } from '@nestjs/testing';
import { FabricController } from './fabric.controller';
import { FabricService } from './fabric.service';

describe('FabricController', () => {
  let controller: FabricController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FabricController],
      providers: [FabricService],
    }).compile();

    controller = module.get<FabricController>(FabricController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
