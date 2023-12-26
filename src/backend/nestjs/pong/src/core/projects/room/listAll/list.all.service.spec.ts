import { Test, TestingModule } from '@nestjs/testing';
import { ListAllService } from './list.all.service';

describe('ListAllService', () => {
  let service: ListAllService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListAllService],
    }).compile();

    service = module.get<ListAllService>(ListAllService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
