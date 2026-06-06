import { Injectable } from '@nestjs/common';
import { CreateSummaryDto } from './dto/create-summary.dto';

@Injectable()
export class SummaryService {
  create(createSummaryDto: CreateSummaryDto) {
    return 'This action adds a new summary';
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
