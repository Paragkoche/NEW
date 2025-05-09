import { Test, TestingModule } from '@nestjs/testing';
import { FabricRageService } from './fabric-rage.service';

describe('FabricRageService', () => {
  let service: FabricRageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FabricRageService],
    }).compile();

    service = module.get<FabricRageService>(FabricRageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
