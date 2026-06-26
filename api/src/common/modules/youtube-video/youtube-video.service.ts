import { HttpExceptionBody, Injectable } from '@nestjs/common';
import { YoutubeVideoId } from '../../value-objects/youtube-video-id.vo';
import { YoutubeTranscript } from 'youtube-transcript';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

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
      select: { slug: true },
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

    let suffix = randomBytes(4).toString('hex');
    let slug = `${base}-${suffix}`;
    let counter = 1;

    while (await this.slugExists(slug)) {
      console.log("YOU ARE THE LUCKY ONE — slug collision detected! Generating a new one...");
      slug = `${slug}-0${counter}`;
      counter++;
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

  async transcript(videoId: string): Promise<string | HttpExceptionBody> {
    try {
      const transcripts = await YoutubeTranscript.fetchTranscript(videoId);
    
      return transcripts.map((segment) => segment.text).join(' ');
    } catch (err) {
      return {
        statusCode: 500,
        message: `Fatal error: ${err}`,
      }
    }
  }
}
