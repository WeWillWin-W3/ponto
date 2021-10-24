import { User as UserModel, user_role } from '@prisma/client';
import {
  createParamDecorator,
  ExecutionContext,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { isLeft } from 'src/core/logic/Either';

export interface Token {
  jwt: string;
  user: UserModel;
}

export const UserRolePriority: Record<user_role, number> = {
  admin: 2,
  manager: 1,
  basic: 0,
};

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  constructor(
    @Inject('TokenRepository')
    private tokenRepository: GenericRepository<Token>,
    @Inject('UserRepository')
    private userRepository: GenericRepository<UserModel>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const token = authorization?.split('Bearer ')?.[1];

    if (!token) {
      return next();
    }

    const tokenOrError = await this.tokenRepository.getOne({ jwt: token });

    if (isLeft(tokenOrError)) {
      return res.json({ error: 'Invalid token', message: 'Invalid token' });
    }

    const userOrError = await this.userRepository.getOne({
      id: tokenOrError.value.user.id,
    });

    if (isLeft(userOrError)) {
      return res.json({ error: 'Invalid token', message: 'Invalid token' });
    }

    req['user'] = userOrError.value;

    return next();
  }
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
