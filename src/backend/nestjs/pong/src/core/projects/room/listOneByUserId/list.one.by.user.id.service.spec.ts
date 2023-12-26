import { Test, TestingModule } from '@nestjs/testing';
import { ListOneByUserIdService } from './list.one.by.user.id.service';

describe('ListOneByUserIdService', () => {
  let service: ListOneByUserIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListOneByUserIdService],
    }).compile();

    service = module.get<ListOneByUserIdService>(ListOneByUserIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
