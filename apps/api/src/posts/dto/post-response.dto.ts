import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class AuthorDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'João Silva' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'joao@example.com' })
  email: string;
}

export class PostResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Como construir um design system com React' })
  title: string;

  @Expose()
  @ApiProperty({ example: 'Neste post vamos explorar...' })
  description: string;

  @Expose()
  @ApiPropertyOptional()
  content: string | null;

  @Expose()
  @ApiPropertyOptional()
  thumbnail: string | null;

  @Expose()
  @ApiProperty({ isArray: true, type: String })
  tags: string[];

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @Type(() => AuthorDto)
  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;

  @Expose()
  @ApiProperty({ example: 5 })
  likesCount: number;

  @Expose()
  @ApiProperty({ example: 3 })
  commentsCount: number;

  @Expose()
  @ApiProperty({ example: false })
  likedByMe: boolean;

  constructor(partial: Partial<PostResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PostListResponseDto {
  @ApiProperty({ type: [PostResponseDto] })
  data: PostResponseDto[];

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 12 })
  limit: number;

  constructor(partial: Partial<PostListResponseDto>) {
    Object.assign(this, partial);
  }
}
