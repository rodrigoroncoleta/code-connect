import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';
import { Post } from './post.entity';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostListResponseDto, PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
    @InjectRepository(PostLike)
    private readonly likesRepo: Repository<PostLike>,
  ) {}

  async findAll(
    q?: string,
    page = 1,
    limit = 12,
    currentUserId?: number,
  ): Promise<PostListResponseDto> {
    const qb = this.postsRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (q && q.trim()) {
      qb.where(
        `(to_tsvector('portuguese', post.title || ' ' || post.description) @@ plainto_tsquery('portuguese', :q) OR post.title ILIKE :like OR post.description ILIKE :like)`,
        { q: q.trim(), like: `%${q.trim()}%` },
      );
    }

    const [posts, total] = await qb.getManyAndCount();

    let likedPostIds = new Set<number>();
    if (currentUserId) {
      const liked = await this.likesRepo.find({
        where: { user: { id: currentUserId } },
        relations: ['post'],
      });
      likedPostIds = new Set(liked.map((l) => l.post.id));
    }

    const data = posts.map((p) =>
      this.toPostDto(p, likedPostIds.has(p.id)),
    );

    return new PostListResponseDto({ data, total, page, limit });
  }

  async findOne(id: number, currentUserId?: number): Promise<PostResponseDto> {
    const post = await this.postsRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) throw new NotFoundException('Post não encontrado');

    let likedByMe = false;
    if (currentUserId) {
      const like = await this.likesRepo.findOne({
        where: { post: { id }, user: { id: currentUserId } },
      });
      likedByMe = !!like;
    }

    return this.toPostDto(post, likedByMe);
  }

  async create(dto: CreatePostDto, author: User): Promise<PostResponseDto> {
    const post = this.postsRepo.create({
      ...dto,
      tags: dto.tags ?? [],
      author,
    });
    const saved = await this.postsRepo.save(post);
    return this.toPostDto({ ...saved, likesCount: 0, commentsCount: 0 } as any, false);
  }

  async like(postId: number, user: User): Promise<void> {
    const post = await this.postsRepo.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post não encontrado');

    const existing = await this.likesRepo.findOne({
      where: { post: { id: postId }, user: { id: user.id } },
    });
    if (existing) throw new ConflictException('Post já curtido');

    await this.likesRepo.save(this.likesRepo.create({ post, user }));
  }

  async unlike(postId: number, userId: number): Promise<void> {
    const like = await this.likesRepo.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    if (!like) throw new NotFoundException('Like não encontrado');
    await this.likesRepo.remove(like);
  }

  async getComments(postId: number): Promise<CommentResponseDto[]> {
    const post = await this.postsRepo.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post não encontrado');

    const comments = await this.commentsRepo.find({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });

    return comments.map((c) => new CommentResponseDto({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: { id: c.author.id, name: c.author.name, email: c.author.email },
    }));
  }

  async addComment(
    postId: number,
    dto: CreateCommentDto,
    author: User,
  ): Promise<CommentResponseDto> {
    const post = await this.postsRepo.findOneBy({ id: postId });
    if (!post) throw new NotFoundException('Post não encontrado');

    const comment = this.commentsRepo.create({ content: dto.content, post, author });
    const saved = await this.commentsRepo.save(comment);

    return new CommentResponseDto({
      id: saved.id,
      content: saved.content,
      createdAt: saved.createdAt,
      author: { id: author.id, name: author.name, email: author.email },
    });
  }

  private toPostDto(post: Post & { likesCount?: number; commentsCount?: number }, likedByMe: boolean): PostResponseDto {
    return new PostResponseDto({
      id: post.id,
      title: post.title,
      description: post.description,
      content: post.content,
      thumbnail: post.thumbnail,
      tags: post.tags,
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
      },
      likesCount: (post as any).likesCount ?? 0,
      commentsCount: (post as any).commentsCount ?? 0,
      likedByMe,
    });
  }
}
