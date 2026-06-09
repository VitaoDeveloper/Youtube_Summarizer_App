import { Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from '../common/modules/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor (private prisma: PrismaService) {}

  async login(dto: AuthLoginDto) {


    return await 'This action adds a new auth';
  }
}
