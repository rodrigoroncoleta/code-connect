import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto, description: 'Login realizado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  login(@Request() req: { user: { id: number; email: string } }): LoginResponseDto {
    return this.authService.login(req.user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto, description: 'Dados do usuário autenticado' })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente' })
  async getMe(@Request() req: { user: { id: number; email: string } }): Promise<UserResponseDto> {
    return this.authService.getMe(req.user.id);
  }
}
