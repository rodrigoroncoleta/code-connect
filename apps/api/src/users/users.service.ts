import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private nextId = 1;

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = this.users.find((u) => u.email === dto.email);
    if (exists) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user: User = {
      id: this.nextId++,
      name: dto.name,
      email: dto.email,
      passwordHash,
    };

    this.users.push(user);
    return new UserResponseDto({ id: user.id, name: user.name, email: user.email });
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }
}
