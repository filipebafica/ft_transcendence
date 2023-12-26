import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageAuthorizationService } from './send.message.authorization.service';

describe('SendMessageAuthorizationService', () => {
  let service: SendMessageAuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendMessageAuthorizationService],
    }).compile();

    service = module.get<SendMessageAuthorizationService>(SendMessageAuthorizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
