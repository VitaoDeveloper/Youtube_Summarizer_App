import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { User } from '../../generated/prisma/client';
import { HashService } from '../common/modules/hash/hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private argon: HashService,
    private jwt: JwtService
  ) {}
  
  async create(dto: CreateUserDto): Promise<{ access_token?: string }> {
    dto.password = await this.argon.hash(dto.password)

    const user = await this.prisma.user.create({ 
      data: dto 
    });

    const payload = { sub: user.id, email: user.email };
    const access_token = user ? this.jwt.sign(payload) : undefined

    return {
      access_token,
      ...user
    };
  } 

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany({
      include: { summaries: true }
    });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      include: { summaries: true },
      where: { id } 
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    if (dto.password) dto.password = await this.argon.hash(dto.password)
    
    return await this.prisma.user.update({
      data: dto,
      where: { id }
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({ 
      where: { id } 
    });
  }
}
