import { Test, TestingModule } from '@nestjs/testing';
import { JoingameService } from './joingame.service';

describe('JoingameService', () => {
  let service: JoingameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoingameService],
    }).compile();

    service = module.get<JoingameService>(JoingameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
