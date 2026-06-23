import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummaryModule } from './summary/summary.module';
import { LlmModule } from './common/modules/llm/llm.module';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HashModule } from './common/modules/hash/hash.module';
import { YoutubeVideoModule } from './common/modules/youtube-video/youtube-video.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    SummaryModule,
    HashModule,
    LlmModule,
    YoutubeVideoModule, 
    PrismaModule,  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
