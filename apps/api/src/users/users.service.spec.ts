import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um usuário e retornar sem a senha', async () => {
      const result = await service.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
      });

      expect(result.id).toBe(1);
      expect(result.name).toBe('João Silva');
      expect(result.email).toBe('joao@example.com');
      expect((result as any).password).toBeUndefined();
      expect((result as any).passwordHash).toBeUndefined();
    });

    it('deve lançar ConflictException se e-mail já estiver cadastrado', async () => {
      await service.create({
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'senha123',
      });

      await expect(
        service.create({
          name: 'Outro João',
          email: 'joao@example.com',
          password: 'outrasenha',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('deve incrementar o id a cada novo usuário', async () => {
      const first = await service.create({ name: 'A', email: 'a@test.com', password: 'abc123' });
      const second = await service.create({ name: 'B', email: 'b@test.com', password: 'abc123' });

      expect(first.id).toBe(1);
      expect(second.id).toBe(2);
    });
  });

  describe('findByEmail', () => {
    it('deve retornar o usuário com passwordHash quando encontrado', async () => {
      await service.create({ name: 'A', email: 'a@test.com', password: 'abc123' });

      const found = await service.findByEmail('a@test.com');
      expect(found).toBeDefined();
      expect(found!.email).toBe('a@test.com');
      expect(found!.passwordHash).toBeDefined();
    });

    it('deve retornar undefined quando e-mail não encontrado', async () => {
      expect(await service.findByEmail('naoexiste@test.com')).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('deve retornar o usuário quando encontrado', async () => {
      const created = await service.create({ name: 'A', email: 'a@test.com', password: 'abc123' });
      const found = await service.findById(created.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
    });

    it('deve retornar undefined quando id não encontrado', async () => {
      expect(await service.findById(999)).toBeUndefined();
    });
  });
});
