import { Injectable } from '@nestjs/common';
import { Provider } from '../../../../generated/prisma/client';

@Injectable()
export class LlmService {
    async getProviders() {
        return Object.values(Provider);
    }

    
}
