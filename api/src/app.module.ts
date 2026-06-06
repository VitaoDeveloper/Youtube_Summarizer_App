import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummaryModule } from './summary/summary.module';
import { LlmModule } from './llm/llm.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SummaryModule, 
    LlmModule, 
    PrismaModule, UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
