import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AuthorDto } from './post-response.dto';

export class CommentResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Ótimo post!' })
  content: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @Type(() => AuthorDto)
  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;

  constructor(partial: Partial<CommentResponseDto>) {
    Object.assign(this, partial);
  }
}
