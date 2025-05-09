import { Test, TestingModule } from '@nestjs/testing';
import { MashVariantsService } from './mash-variants.service';

describe('MashVariantsService', () => {
  let service: MashVariantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MashVariantsService],
    }).compile();

    service = module.get<MashVariantsService>(MashVariantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
