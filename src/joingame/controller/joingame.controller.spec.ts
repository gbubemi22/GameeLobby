import { Test, TestingModule } from '@nestjs/testing';
import { JoingameController } from '../joingame.controller';
import { JoingameService } from '../service/joingame.service';

describe('JoingameController', () => {
  let controller: JoingameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JoingameController],
      providers: [JoingameService],
    }).compile();

    controller = module.get<JoingameController>(JoingameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
