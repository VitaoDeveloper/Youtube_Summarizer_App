import { Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { HashService } from 'src/common/modules/hash/hash.service';
import { User } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  constructor (
    private prisma: PrismaService,
    private validation: HashService
  ) {}

  private async userExists(email: string): Promise<{ exists: boolean, hash: string | null }> {
    const hash = await this.prisma.user.findUnique({ 
      where: { email },
      select: { password: true } 
    });

    const exists = hash ? true : false;

    return {
      exists,
      hash: hash?.password!
    };
  }

  async login(dto: AuthLoginDto) {
    const user = await this.userExists(dto.email);
    
    if (user.exists) {
      const access = await this.validation.verify(user.hash! ,dto.password);

      const token = access ? "access_token" : undefined;

      return {
        access,
        token: token
      };
    }

    return user;
  }
}
