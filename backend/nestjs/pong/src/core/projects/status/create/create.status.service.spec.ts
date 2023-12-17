import { Test, TestingModule } from '@nestjs/testing';
import { CreateStatusService } from './create.status.service';

describe('CreateStatusService', () => {
  let service: CreateStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateStatusService],
    }).compile();

    service = module.get<CreateStatusService>(CreateStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
