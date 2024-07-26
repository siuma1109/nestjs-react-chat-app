import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User,
  ) {}

  async create({ email, username, password }: CreateUserDto): Promise<any> {
    const userByEmail = await this.findByEmail(email);

    if (userByEmail) throw new ConflictException('User already exists.');

    const user = await this.usersRepository.create({
      email,
      username,
      password,
    });

    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.usersRepository.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) throw new ConflictException('User not exists.');
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async update(user: any): Promise<any> {
    try {
      const updatedUser = await this.usersRepository.update(user, {
        where: { id: user.id },
      });
      return updatedUser;
    } catch {
      return {
        statusCode: '409',
        message: 'This username is already in use.',
      };
    }
  }
}
