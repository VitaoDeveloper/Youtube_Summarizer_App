import { Injectable } from '@nestjs/common';
import { Provider } from '../../../../generated/prisma/client';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai'
import type { LanguageModel, ModelMessage } from 'ai';
import { CreateSummaryDto } from 'src/summary/dto/create-summary.dto';
import { YoutubeVideoService } from '../youtube-video/youtube-video.service';
import { z } from 'zod';

@Injectable()
export class LlmService {
    constructor (private video: YoutubeVideoService) {}
    
    async getProviders() {
        return Object.values(Provider);
    }

    async createClient(apiKey: string, provider: Provider): Promise<LanguageModel> {
        switch (provider) {
            case 'OpenAI':
                return createOpenAI({apiKey})('gpt-5.4-pro');
            case 'Anthropic':
                return createAnthropic({apiKey})('claude-opus-4-6');
            case 'Google':
                return createGoogleGenerativeAI({apiKey})('gemini-2.5-pro');
            default:
                throw new Error('No provider found. Check your profile.');
        }
    }

    async generateSummary(client: LanguageModel, dto: CreateSummaryDto, transcription: string) {
        const schema = z.object({
            summary: z.string().describe('Main summary of the transcript'),
            topics: z.array(z.string()).length(4).describe('Four topics extracted from the transcript'),
        });

        const messages: ModelMessage[] = [
            {
                role: "system",
                content: `You are an expert at summarizing ${dto.length} video transcripts.
                          The summary must be written in: ${dto.language}.
                          Extract exactly four topics from the transcript that match the video's purpose.
                          Each topic should be concise (a few words), not a full sentence.`
            },
            {
                role: "user",
                content: transcription
            }
        ];

        const summary = await generateObject({
            model: client,
            schema,
            messages
        });
        
        return summary.object;
    }
}
