import { Injectable } from '@nestjs/common';
import { Provider } from '../../../../generated/prisma/client';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, type LanguageModel } from 'ai'
import { CreateSummaryDto } from 'src/summary/dto/create-summary.dto';

@Injectable()
export class LlmService {
    constructor () {}
    
    async getProviders() {
        return Object.values(Provider);
    }

    async createClient(apiKey: string, provider: Provider): Promise<LanguageModel> {
        switch (provider) {
            case 'OpenAI':
                return createOpenAI({apiKey})('gpt-5.4-pro');
            case 'Anthropic':
                return createAnthropic({apiKey})('claude-opus-4-6')
            case 'Google':
                return createGoogleGenerativeAI({apiKey})('gemini-2.5-pro')
            default:
                throw new Error('No provider found. Check your profile.');
        }
    }

    async generateSummary(client: LanguageModel, dto: CreateSummaryDto) {
        const summary = await generateText({
            model: client,
            prompt: `Resuma esse video: ${dto.videoUrl}`
        })
        
        return summary.output;
    }
}
