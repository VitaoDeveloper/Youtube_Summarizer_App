import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { CreateSummaryDto } from './dto/create-summary.dto';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Post()
  create(@Body() createSummaryDto: CreateSummaryDto) {
    return this.summaryService.create(createSummaryDto);
  }

  @Get()
  findAll() {
    return this.summaryService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.summaryService.findOne(+slug);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.summaryService.remove(+id);
  }
}
