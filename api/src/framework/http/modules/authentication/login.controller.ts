import { Body, Controller, Inject, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { IsString } from 'class-validator';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { isLeft, mapLeft } from 'src/core/logic/Either';
import { Token } from '../../middlewares/authenticate.middleware';
import { randomUUID } from 'crypto';

class LoginDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

@Controller('/login')
export class LoginController {
  constructor(
    @Inject('UserRepository') private userRepository: GenericRepository<User>,
    @Inject('TokenRepository')
    private tokenRepository: GenericRepository<Token>,
  ) {}

  @Post()
  async login(@Body() loginDto: LoginDTO) {
    const { username, password: plainPassword } = loginDto;

    const userOrError = await this.userRepository.getOne({ username });

    if (isLeft(userOrError)) {
      return { message: 'User not exists' };
    }

    // TODO: bcrypt password
    // if (!bcrypt.compare(plainPassword, userOrError.value.password))
    if (plainPassword !== userOrError.value.password) {
      return { message: 'Wrong password' };
    }

    // TODO: token generation
    // TODO: specific tokenRepository
    const tokenOrError = await this.tokenRepository.create({
      jwt: randomUUID(),
      user: userOrError.value,
    });

    const tokenOrErrorMessage = mapLeft(tokenOrError, (err) => ({
      message: `Cannot create token: ${err.message}`,
    }));

    return tokenOrErrorMessage.value;
  }
}
