import { HttpExceptionBody, Injectable } from '@nestjs/common';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { YoutubeVideoService } from 'src/common/modules/youtube-video/youtube-video.service';
import { LlmService } from 'src/common/modules/llm/llm.service';
import { UserService } from 'src/user/user.service';
import { Summary } from 'generated/prisma/client';

@Injectable()
export class SummaryService {
  constructor (
    private prisma: PrismaService,
    private video: YoutubeVideoService,
    private user: UserService, 
    private llm: LlmService, 
  ) {}
  
  async create(dto: CreateSummaryDto): Promise<Summary | HttpExceptionBody> {
    const userData = await this.user.findOne(dto.userId);
    
    if (!userData) return { 
      statusCode: 400,
      message: 'No user found.' 
    }; 
    
    const videoId = this.video.getVideoId(dto.videoUrl);
    if (typeof videoId != 'string') return videoId;

    const existing = await this.prisma.summary.findFirst({
      where: { userId: dto.userId, videoId }
    });
    if (existing) return existing;
    
    const [videoTitle, transcription] = await Promise.all([
      this.video.getVideoTitle(videoId),
      this.video.transcript(videoId)
    ]);

    if (typeof videoTitle != 'string') return videoTitle;
    if (typeof transcription != 'string') return transcription;
    
    const slug = await this.video.generateSlug(videoTitle);
    

    const llmClient = await this.llm.createClient(userData.apiKey, userData.llmProvider);
    const { summary, topics } = await this.llm.generateSummary(llmClient, dto, transcription);

    return await this.prisma.summary.create({
      data: {
        topics,
        videoTitle,
        videoId,
        slug,
        summary: transcription,
        ...dto, 
      }
    });
  }

  async findAll() {
    return await this.prisma.summary.findMany();
  }

  async findBySlug(slug: string) {
    return await this.prisma.summary.findUnique({
      where: { slug }
    });
  }

  async remove(slug: string) {
    return await this.prisma.summary.delete({
      where: { slug }
    });
  }
}
