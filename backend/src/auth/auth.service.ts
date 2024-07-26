import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UsersService } from 'src/user/users.service';
import * as bcrypt from 'bcryptjs';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException();

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      delete user.password;
      return user;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.findByEmail(createUserDto.email);
    if (user) throw new ConflictException('User already exists.');

    await this.usersService.create(createUserDto);
    return {
      statusCode: 201,
      message: 'User created',
    };
  }

  async login(authUserDto: AuthUserDto) {
    return {
      statusCode: 200,
      access_token: this.jwtService.sign(authUserDto, {
        secret: `${process.env.JWT_SECRET}`,
      }),
    };
  }
}
