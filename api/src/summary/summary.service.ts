import { Injectable } from '@nestjs/common';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { LlmService } from 'src/common/modules/llm/llm.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SummaryService {
  constructor (
    private prisma: PrismaService,
    private user: UserService, 
    private llm: LlmService, 
  ) {}
  
  async create(dto: CreateSummaryDto) {
    const userData = await this.user.findOne(dto.userId);
    const llmClient = userData 
      ? this.llm.createClient(userData.apiKey, userData.llmProvider) 
      : 'No user found.'

    return llmClient;
  }

  findAll() {
    return `This action returns all summary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} summary`;
  }

  remove(id: number) {
    return `This action removes a #${id} summary`;
  }
}
