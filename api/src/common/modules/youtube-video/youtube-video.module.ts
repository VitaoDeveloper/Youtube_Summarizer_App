import { Global, Module } from '@nestjs/common';
import { YoutubeVideoService } from './youtube-video.service';

@Global()
@Module({
  providers: [YoutubeVideoService],
  exports: [YoutubeVideoService]
})
export class YoutubeVideoModule {}
