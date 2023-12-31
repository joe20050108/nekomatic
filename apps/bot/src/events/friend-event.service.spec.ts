import { Test, TestingModule } from '@nestjs/testing';
import { FriendEventService } from './friend-event.service';

describe('FriendEventService', () => {
  let service: FriendEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendEventService],
    }).compile();

    service = module.get<FriendEventService>(FriendEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
