import { Body, Controller, Inject, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { IsString } from 'class-validator';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { isLeft } from 'src/core/logic/Either';
import { GenerateAuthTokenUseCase } from 'src/core/usecases/generateauthtoken.usecase';
import { AuthToken } from 'src/core/entities/authtoken.entity';
import { UseCaseInstance } from 'src/core/domain/usecase.entity';
import { GenerateJWTUseCase } from 'src/core/usecases/generatejwt.usecase';

class LoginDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

@Controller('/login')
export class LoginController {
  private generateAuthToken: UseCaseInstance<typeof GenerateAuthTokenUseCase>;

  constructor(
    @Inject('UserRepository') private userRepository: GenericRepository<User>,
    @Inject('TokenRepository')
    private tokenRepository: GenericRepository<AuthToken>,
  ) {
    // TODO: Get secret from .env
    const generateJWTUseCase = GenerateJWTUseCase({ secret: 'secret' });

    this.generateAuthToken = GenerateAuthTokenUseCase({ generateJWTUseCase });
  }

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

    const token = this.generateAuthToken({ user: userOrError.value });

    // TODO: specific tokenRepository
    const tokenOrError = await this.tokenRepository.create(token);

    if (isLeft(tokenOrError)) {
      return {
        message: `Cannot create token: ${tokenOrError.value.message}`,
      };
    }

    return tokenOrError.value.jwt;
  }
}
