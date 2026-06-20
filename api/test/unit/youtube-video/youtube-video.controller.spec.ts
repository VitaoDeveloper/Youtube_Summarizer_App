import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeVideoController } from './youtube-video.controller';
import { YoutubeVideoService } from './youtube-video.service';

describe('YoutubeVideoController', () => {
  let controller: YoutubeVideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YoutubeVideoController],
      providers: [YoutubeVideoService],
    }).compile();

    controller = module.get<YoutubeVideoController>(YoutubeVideoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
