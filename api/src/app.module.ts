import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummaryModule } from './summary/summary.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [SummaryModule, LlmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
