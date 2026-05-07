import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostListResponseDto, PostResponseDto } from './dto/post-response.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiQuery({ name: 'q', required: false, description: 'Full-text search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['recentes', 'populares'] })
  @ApiOkResponse({ type: PostListResponseDto })
  findAll(
    @Query('q') q?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '12',
    @Query('sort') sort: 'recentes' | 'populares' = 'recentes',
    @Request() req?: { user?: { id: number } },
  ): Promise<PostListResponseDto> {
    return this.postsService.findAll(
      q,
      Number(page),
      Math.min(Number(limit), 100),
      req?.user?.id,
      sort,
    );
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOkResponse({ type: PostResponseDto })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req?: { user?: { id: number } },
  ): Promise<PostResponseDto> {
    return this.postsService.findOne(id, req?.user?.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PostResponseDto })
  create(
    @Body() dto: CreatePostDto,
    @Request() req: { user: { id: number } },
  ): Promise<PostResponseDto> {
    return this.postsService.create(dto, req.user.id);
  }

  @Post(':id/likes')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  like(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { id: number } },
  ): Promise<void> {
    return this.postsService.like(id, req.user.id);
  }

  @Delete(':id/likes')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  unlike(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { id: number } },
  ): Promise<void> {
    return this.postsService.unlike(id, req.user.id);
  }

  @Get(':id/comments')
  @ApiOkResponse({ type: [CommentResponseDto] })
  getComments(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CommentResponseDto[]> {
    return this.postsService.getComments(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CommentResponseDto })
  addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCommentDto,
    @Request() req: { user: { id: number } },
  ): Promise<CommentResponseDto> {
    return this.postsService.addComment(id, dto, req.user.id);
  }
}
