import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummaryModule } from './summary/summary.module';
import { LlmModule } from './modules/llm/llm.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HashModule } from './modules/hash/hash.module';
import { HashService } from './modules/hash/hash.service';

@Module({
  imports: [
    UserModule,
    AuthModule,
    SummaryModule,
    HashModule, 
    LlmModule, 
    PrismaModule 
  ],
  controllers: [AppController],
  providers: [AppService, HashService],
})
export class AppModule {}
