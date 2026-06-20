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

  findOne(id: number) {
    return `This action returns a #${id} summary`;
  }

  remove(id: number) {
    return `This action removes a #${id} summary`;
  }
}
