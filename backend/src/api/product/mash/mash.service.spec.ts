import { Test, TestingModule } from '@nestjs/testing';
import { MashService } from './mash.service';

describe('MashService', () => {
  let service: MashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MashService],
    }).compile();

    service = module.get<MashService>(MashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
