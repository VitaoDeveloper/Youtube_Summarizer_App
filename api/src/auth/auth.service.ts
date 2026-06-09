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

  private async userExists(email: string): Promise<{ exists: boolean, hash: Partial<User> | null }> {
    const hash = await this.prisma.user.findUnique({ 
      where: { email },
      select: { password: true } 
    });

    const exists = hash ? true : false;

    return {
      exists,
      hash
    };
  }

  async login(dto: AuthLoginDto) {
    //const user: boolean = await this.userExists(dto.email) ? true : false;

    if (1==1) {
      //const validate = this.validation.verify(, dto.password) 
    }

    return "user";
  }
}
