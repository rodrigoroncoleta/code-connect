import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

const mockUsersService = {
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('deve retornar null quando usuário não encontrado', async () => {
      mockUsersService.findByEmail.mockReturnValue(undefined);
      const result = await service.validateUser('nao@existe.com', 'qualquer');
      expect(result).toBeNull();
    });

    it('deve retornar null quando senha incorreta', async () => {
      mockUsersService.findByEmail.mockReturnValue({
        id: 1,
        name: 'João',
        email: 'joao@test.com',
        // hash de 'senhaCorreta' — senhas diferentes devem falhar
        passwordHash: '$2b$10$invalidhashThatWillNotMatch',
      });
      const result = await service.validateUser('joao@test.com', 'senhaErrada');
      expect(result).toBeNull();
    });

    it('deve retornar o usuário sem passwordHash quando credenciais corretas', async () => {
      const hash = await bcrypt.hash('senha123', 10);

      mockUsersService.findByEmail.mockReturnValue({
        id: 1,
        name: 'João',
        email: 'joao@test.com',
        passwordHash: hash,
      });

      const result = await service.validateUser('joao@test.com', 'senha123');
      expect(result).toEqual({ id: 1, name: 'João', email: 'joao@test.com' });
      expect((result as any)?.passwordHash).toBeUndefined();
    });
  });

  describe('login', () => {
    it('deve retornar access_token assinado', () => {
      const result = service.login({ id: 1, email: 'joao@test.com' });
      expect(result).toEqual({ access_token: 'mocked.jwt.token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 1, email: 'joao@test.com' });
    });
  });
});
