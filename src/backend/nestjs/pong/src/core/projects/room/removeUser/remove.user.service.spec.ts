import { Test, TestingModule } from '@nestjs/testing';
import { RemoveUserService } from './remove.user.service';

describe('RemoveUserService', () => {
  let service: RemoveUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoveUserService],
    }).compile();

    service = module.get<RemoveUserService>(RemoveUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
