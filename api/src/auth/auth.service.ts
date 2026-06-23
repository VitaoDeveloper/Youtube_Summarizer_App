import { Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { HashService } from 'src/common/modules/hash/hash.service';
import { User } from 'generated/prisma/client';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor (
    private prisma: PrismaService,
    private argon: HashService,
    private jwt: JwtService
  ) {}

  private async userExists(email: string): Promise<{ exists: boolean, user: User | null }> {
    const user = await this.prisma.user.findUnique({ 
      where: { email } 
    });

    const exists = user ? true : false;

    return {
      exists,
      user
    };
  }

  async login(dto: AuthLoginDto) {
    const { exists, user } = await this.userExists(dto.email);
    
    if (exists) {
      const access = await this.argon.verify(user!.password ,dto.password);

      const payload = { sub: user!.id, email: user!.email }
      const token = access ? this.jwt.sign(payload) : undefined;

      return {
        access,
        token
      };
    }

    return { exists };
  }
}
