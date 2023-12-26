import { Test, TestingModule } from '@nestjs/testing';
import { ListByUserIdService } from './list.by.user.id.service';

describe('ListByUserIdService', () => {
  let service: ListByUserIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListByUserIdService],
    }).compile();

    service = module.get<ListByUserIdService>(ListByUserIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
