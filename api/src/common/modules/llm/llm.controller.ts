import { Controller, Get } from '@nestjs/common';
import { LlmService } from './llm.service';

@Controller('llm')
export class LlmController {
    constructor (private llmService: LlmService) {}
    
    @Get('providers')
    getProviders() {
        return this.llmService.getProviders();
    }

}
