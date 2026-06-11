import { argon2id, hash, verify, Options } from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
    async hash(text: string): Promise<string> {
        const options: Options = {
            type: argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 2
        };

        const hashed = await hash(text, options);

        return hashed;
    }

    async verify(hash: string, text: string): Promise<boolean> {
        const validation = await verify(hash, text);
        
        return validation;
    }
}
