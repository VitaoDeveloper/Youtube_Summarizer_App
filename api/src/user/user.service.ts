import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async create(dto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ 
      data: dto 
    });
  } 

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ 
      where: { id } 
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
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
