import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Comment } from './comment.entity';
import { CommentResponseDto } from './dto/comment-response.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostLike } from './post-like.entity';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

const mockPost = {
  id: 1,
  title: 'Test Post',
  description: 'Test description longa o suficiente',
  content: null,
  thumbnail: null,
  tags: ['React'],
  createdAt: new Date('2026-01-01'),
  author: { id: 1, name: 'João', email: 'joao@test.com' },
  comments: [],
  likes: [],
  likesCount: 0,
  commentsCount: 0,
};

const mockUser = {
  id: 1,
  name: 'João',
  email: 'joao@test.com',
  passwordHash: 'hash',
};

const mockPostsRepo = {
  createQueryBuilder: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockCommentsRepo = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockLikesRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockUsersService = {
  findById: jest.fn(),
};

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockPostsRepo },
        { provide: getRepositoryToken(Comment), useValue: mockCommentsRepo },
        { provide: getRepositoryToken(PostLike), useValue: mockLikesRepo },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('deve retornar PostResponseDto quando post existe', async () => {
      const qbMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        loadRelationCountAndMap: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockPost),
      };
      mockPostsRepo.createQueryBuilder.mockReturnValue(qbMock);
      mockLikesRepo.findOne.mockResolvedValue(null);

      const result = await service.findOne(1);
      expect(result).toBeInstanceOf(PostResponseDto);
      expect(result.id).toBe(1);
      expect(result.likedByMe).toBe(false);
    });

    it('deve definir likedByMe=true quando usuário curtiu', async () => {
      const qbMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        loadRelationCountAndMap: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockPost),
      };
      mockPostsRepo.createQueryBuilder.mockReturnValue(qbMock);
      mockLikesRepo.findOne.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1, 1);
      expect(result.likedByMe).toBe(true);
    });

    it('deve lançar NotFoundException quando post não existe', async () => {
      const qbMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        loadRelationCountAndMap: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockPostsRepo.createQueryBuilder.mockReturnValue(qbMock);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar post e retornar PostResponseDto', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);
      mockPostsRepo.create.mockReturnValue({ ...mockPost });
      mockPostsRepo.save.mockResolvedValue({ ...mockPost });

      const dto = {
        title: 'Test',
        description: 'Test description longa',
        tags: ['React'],
      };
      const result = await service.create(dto, 1);

      expect(result).toBeInstanceOf(PostResponseDto);
      expect(mockUsersService.findById).toHaveBeenCalledWith(1);
    });

    it('deve lançar UnauthorizedException se usuário não existe', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(
        service.create({ title: 'T', description: 'Test description' }, 999),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('like', () => {
    it('deve lançar NotFoundException quando post não existe', async () => {
      mockPostsRepo.findOneBy.mockResolvedValue(null);
      await expect(service.like(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ConflictException se já curtiu', async () => {
      mockPostsRepo.findOneBy.mockResolvedValue(mockPost);
      mockLikesRepo.findOne.mockResolvedValue({ id: 1 });
      await expect(service.like(1, 1)).rejects.toThrow(ConflictException);
    });

    it('deve salvar like quando válido', async () => {
      mockPostsRepo.findOneBy.mockResolvedValue(mockPost);
      mockLikesRepo.findOne.mockResolvedValue(null);
      mockLikesRepo.create.mockReturnValue({ post: mockPost, user: { id: 1 } });
      mockLikesRepo.save.mockResolvedValue({});

      await expect(service.like(1, 1)).resolves.toBeUndefined();
      expect(mockLikesRepo.save).toHaveBeenCalled();
    });
  });

  describe('unlike', () => {
    it('deve lançar NotFoundException quando like não existe', async () => {
      mockLikesRepo.findOne.mockResolvedValue(null);
      await expect(service.unlike(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('deve remover o like quando existe', async () => {
      const like = { id: 1 };
      mockLikesRepo.findOne.mockResolvedValue(like);
      mockLikesRepo.remove.mockResolvedValue(like);

      await expect(service.unlike(1, 1)).resolves.toBeUndefined();
      expect(mockLikesRepo.remove).toHaveBeenCalledWith(like);
    });
  });

  describe('getComments', () => {
    it('deve lançar NotFoundException quando post não existe', async () => {
      mockPostsRepo.findOneBy.mockResolvedValue(null);
      await expect(service.getComments(999)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar lista de CommentResponseDto', async () => {
      mockPostsRepo.findOneBy.mockResolvedValue(mockPost);
      mockCommentsRepo.find.mockResolvedValue([
        {
          id: 1,
          content: 'Ótimo post!',
          createdAt: new Date(),
          author: { id: 1, name: 'João', email: 'joao@test.com' },
        },
      ]);

      const result = await service.getComments(1);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(CommentResponseDto);
      expect(result[0].content).toBe('Ótimo post!');
    });
  });

  describe('addComment', () => {
    it('deve lançar NotFoundException quando post não existe', async () => {
      mockPostsRepo.findOneBy.mockResolvedValue(null);
      mockUsersService.findById.mockResolvedValue(mockUser);
      await expect(service.addComment(999, { content: 'ok' }, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar UnauthorizedException se usuário não existe', async () => {
      mockPostsRepo.findOneBy.mockResolvedValue(mockPost);
      mockUsersService.findById.mockResolvedValue(null);
      await expect(service.addComment(1, { content: 'ok' }, 999)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('deve retornar CommentResponseDto ao adicionar comentário', async () => {
      mockPostsRepo.findOneBy.mockResolvedValue(mockPost);
      mockUsersService.findById.mockResolvedValue(mockUser);
      const savedComment = {
        id: 1,
        content: 'Ótimo!',
        createdAt: new Date(),
        author: mockUser,
      };
      mockCommentsRepo.create.mockReturnValue(savedComment);
      mockCommentsRepo.save.mockResolvedValue(savedComment);

      const result = await service.addComment(1, { content: 'Ótimo!' }, 1);
      expect(result).toBeInstanceOf(CommentResponseDto);
      expect(result.content).toBe('Ótimo!');
    });
  });
});
