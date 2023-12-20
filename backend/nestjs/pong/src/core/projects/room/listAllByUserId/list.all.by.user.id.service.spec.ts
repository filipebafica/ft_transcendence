import { Test, TestingModule } from '@nestjs/testing';
import { ListAllByUserIdService } from './list.all.by.user.id.service';

describe('ListAllByUserIdService', () => {
  let service: ListAllByUserIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListAllByUserIdService],
    }).compile();

    service = module.get<ListAllByUserIdService>(ListAllByUserIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
