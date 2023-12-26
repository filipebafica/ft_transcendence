import { Test, TestingModule } from '@nestjs/testing';
import { UnmuteUserService } from './unmute.user.service';

describe('UnmuteUserService', () => {
  let service: UnmuteUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnmuteUserService],
    }).compile();

    service = module.get<UnmuteUserService>(UnmuteUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
