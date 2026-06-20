import { HttpExceptionBody, Injectable } from '@nestjs/common';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { LlmService } from 'src/common/modules/llm/llm.service';
import { UserService } from 'src/user/user.service';
import { LanguageModel } from 'ai';

@Injectable()
export class SummaryService {
  constructor (
    private prisma: PrismaService,
    private user: UserService, 
    private llm: LlmService, 
  ) {}
  
  async create(dto: CreateSummaryDto): Promise<LanguageModel | HttpExceptionBody|any> {
    const userData = await this.user.findOne(dto.userId);

    if (!userData) return { 
      statusCode: 400,
      message: 'No user found.' 
    }; 

    const llmClient = await this.llm.createClient(userData.apiKey, userData.llmProvider);
    const summary = await this.llm.generateSummary(llmClient, dto);

    return await this.prisma.summary.create({
      data: {
        topics: ['', ''],
        videoTitle: '',
        videoId: '',
        slug: 'slug',
        summary,
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
