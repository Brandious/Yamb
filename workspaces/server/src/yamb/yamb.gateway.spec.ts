import { Test, TestingModule } from '@nestjs/testing';
import { YambGateway } from './yamb.gateway';

describe('YambGateway', () => {
  let gateway: YambGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YambGateway],
    }).compile();

    gateway = module.get<YambGateway>(YambGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
