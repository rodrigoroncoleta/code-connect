import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UsersService } from '../users/users.service';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;

    const { passwordHash: _, ...result } = user;
    return result;
  }

  login(user: { id: number; email: string }): LoginResponseDto {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async getMe(id: number): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    return new UserResponseDto({ id: user.id, name: user.name, email: user.email });
  }
}
