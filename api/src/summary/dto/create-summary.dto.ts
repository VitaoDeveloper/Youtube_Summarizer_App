import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSummaryDto {
  @ApiProperty({
    description: 'Video URL',
    example: 'https://youtube.com/watch?v=...'
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'UserId related to summary',
    format: 'uuid'
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Summary language',
    example: 'en',
    maxLength: 2
  })
  @IsString()
  language: string;

  @ApiProperty({
    description: 'Video length',
    example: 'medium'
  })
  @IsString()
  length: string;
}