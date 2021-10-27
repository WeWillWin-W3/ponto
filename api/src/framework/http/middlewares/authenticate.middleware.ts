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
import { AuthToken } from 'src/core/entities/authtoken.entity';

export const UserRolePriority: Record<user_role, number> = {
  admin: 2,
  manager: 1,
  basic: 0,
};

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  constructor(
    @Inject('TokenRepository')
    private tokenRepository: GenericRepository<AuthToken>,
    @Inject('UserRepository')
    private userRepository: GenericRepository<UserModel>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const token = authorization?.split('Bearer ')?.[1];

    if (!token) {
      return res.json({ error: 'Invalid token', message: 'Invalid token' });
    }

    const tokenOrError = await this.tokenRepository.getOne({ jwt: token });

    if (isLeft(tokenOrError)) {
      return res.json({ error: 'Invalid token', message: 'Invalid token' });
    }

    if (tokenOrError.value.company === undefined) {
      return res.json({
        error: 'Undefined company',
        message: 'An user token must company ....',
      });
    }

    const userOrError = await this.userRepository.getOne({
      id: tokenOrError.value.subject,
    });

    if (isLeft(userOrError)) {
      return res.json({ error: 'Invalid token', message: 'Invalid token' });
    }

    req['authToken'] = tokenOrError.value;
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

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.authToken;
  },
);
