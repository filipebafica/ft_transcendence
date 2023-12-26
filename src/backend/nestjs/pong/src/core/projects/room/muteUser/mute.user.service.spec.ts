import { Test, TestingModule } from '@nestjs/testing';
import { MuteUserService } from './mute.user.service';

describe('MuteUserService', () => {
  let service: MuteUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MuteUserService],
    }).compile();

    service = module.get<MuteUserService>(MuteUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
