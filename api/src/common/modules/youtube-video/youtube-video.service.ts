import { Injectable } from '@nestjs/common';
import { YoutubeVideoId } from 'src/common/value-objects/youtube-video-id.vo';
import { fetchTranscript } from 'youtube-transcript-plus';

@Injectable()
export class YoutubeVideoService {
  async getVideoId(videoUrl: string) {
    const videoId = YoutubeVideoId.create(videoUrl);

    return videoId instanceof YoutubeVideoId 
      ? videoId.getValue()
      : videoId
  }

  async getVideoTitle() {}

  async trancript(videoId: string) {
    return await fetchTranscript(videoId);
  }
}
