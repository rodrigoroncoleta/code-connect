import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Ótimo post!' })
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;
}
