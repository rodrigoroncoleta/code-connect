import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

const mockAuthService = {
  login: jest.fn().mockReturnValue({ access_token: 'mocked.jwt.token' }),
  getMe: jest.fn().mockResolvedValue(new UserResponseDto({ id: 1, name: 'João', email: 'joao@test.com' })),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: (ctx: ExecutionContext) => true })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (ctx: ExecutionContext) => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('deve retornar access_token', () => {
      const req = { user: { id: 1, email: 'joao@test.com' } };
      const result = controller.login(req);
      expect(result).toEqual({ access_token: 'mocked.jwt.token' });
      expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
    });
  });

  describe('getMe', () => {
    it('deve retornar UserResponseDto com id e email do token', async () => {
      const req = { user: { id: 1, email: 'joao@test.com' } };
      const result = await controller.getMe(req);
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.id).toBe(1);
      expect(result.email).toBe('joao@test.com');
    });
  });
});
