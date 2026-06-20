import { HttpExceptionBody, Injectable } from '@nestjs/common';
import { YoutubeVideoId } from 'src/common/value-objects/youtube-video-id.vo';
import { fetchTranscript } from 'youtube-transcript-plus';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class YoutubeVideoService {
  constructor (private prisma: PrismaService) {}
  
  getVideoId(videoUrl: string) {
    const videoId = YoutubeVideoId.create(videoUrl);
    
    return videoId instanceof YoutubeVideoId 
      ? videoId.getValue()
      : videoId;
  }

  private async slugExists(slug: string) {
    const exists = await this.prisma.summary.findUnique({ 
      where: { slug }
    });
    return !!exists;
  }

  async generateSlug(videoTitle: string) {
    const base = videoTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    let slug = base;
    let counter = 1;

    while (await this.slugExists(base)) {
      slug = `${slug}-0${counter}`;
      counter++;
      return slug;
    }

    return slug;
  }

  async getVideoTitle(videoId: string): Promise<string | HttpExceptionBody> {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);

    if (!response.ok) {
      return {
        statusCode: 400,
        message: 'Cannot fetch video title. Check video ID.'
      }
    }

    const data = await response.json();
    return data.title;
  }

  async trancript(videoId: string) {
    const segments = await fetchTranscript(videoId);
    const transcript = segments.map((segment) => segment.text).join(' ');
    
    return transcript;
  }
}
