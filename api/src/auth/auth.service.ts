import { Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  async login(dto: AuthLoginDto) {
    return await 'This action adds a new auth';
  }
}
