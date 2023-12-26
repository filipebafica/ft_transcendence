import { Test, TestingModule } from '@nestjs/testing';
import { ListStatsByUserIdService } from './list.stats.by.user.id.service';

describe('ListStatsByUserIdService', () => {
  let service: ListStatsByUserIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListStatsByUserIdService],
    }).compile();

    service = module.get<ListStatsByUserIdService>(ListStatsByUserIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
