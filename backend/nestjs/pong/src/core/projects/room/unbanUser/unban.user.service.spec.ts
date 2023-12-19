import { Test, TestingModule } from '@nestjs/testing';
import { UnbanUserService } from './unban.user.service';

describe('UnbanUserService', () => {
  let service: UnbanUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnbanUserService],
    }).compile();

    service = module.get<UnbanUserService>(UnbanUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
