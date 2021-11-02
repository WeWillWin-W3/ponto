import {
  createParamDecorator,
  ExecutionContext,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { AuthToken } from 'src/core/entities/authtoken.entity';
import { UseCaseInstance } from 'src/core/domain/usecase.entity';
import { User as UserEntity, UserRole } from 'src/core/entities/user.entity';
import { ValdiateTokenUseCase } from 'src/core/usecases/authentication/validatetoken.usecase';
import { ConfigService } from '@nestjs/config';
import { isLeft } from 'src/core/logic/Either';

export const UserRolePriority: Record<UserRole, number> = {
  admin: 2,
  manager: 1,
  basic: 0,
};

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  private validateTokenUseCase: UseCaseInstance<ValdiateTokenUseCase>;

  constructor(
    @Inject('TokenRepository')
    private tokenRepository: GenericRepository<AuthToken>,
    @Inject('UserRepository')
    private userRepository: GenericRepository<UserEntity>,
    private configService: ConfigService,
  ) {
    const secret = this.configService.get<string>('JWT_SECRET');

    this.validateTokenUseCase = ValdiateTokenUseCase({
      tokenRepository: this.tokenRepository,
      userRepository: this.userRepository,
      secret,
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const token = authorization?.split('Bearer ')?.[1];

    const tokenValidationResult = await this.validateTokenUseCase({ token });

    if (isLeft(tokenValidationResult)) {
      const { name: error, message } = tokenValidationResult.value;

      return res.json({
        error,
        message,
      });
    }

    const { authToken, user } = tokenValidationResult.value;

    req['authToken'] = authToken;
    req['user'] = user;

    return next();
  }
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.authToken;
  },
);
