import { Injectable } from '@nestjs/common';
import { fetchTranscript } from 'youtube-transcript-plus';

@Injectable()
export class YoutubeVideoService {
  async trancript(videoId: string) {
    return await fetchTranscript(videoId);
  }
}
