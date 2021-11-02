import { User } from '../../entities/user.entity';
import {
  GenericRepository,
  RepositoryError,
} from '../../data-providers/generic.repository';
import { UseCase } from '../../domain/usecase.entity';
import { Either, isLeft, left, right } from '../../logic/Either';
import { AuthToken } from '../../entities/authtoken.entity';
import * as jwt from 'jsonwebtoken';
import {
  CompanyNotSetError,
  InvalidTokenError,
  MissingTokenError,
  TokenError,
} from '../errors/token.error';
import { InvalidCompanyError } from '../errors/authentication.error';

type TokenValidator = (token: string, secret: string) => boolean;

type Dependencies = {
  tokenValidator?: TokenValidator;
  secret: string;
  tokenRepository: GenericRepository<AuthToken>;
  userRepository: GenericRepository<User>;
};

type Properties = {
  token: AuthToken['jwt'] | undefined;
};

type ReturnData = {
  user: User;
  authToken: AuthToken;
};

export type ValdiateTokenUseCase = UseCase<
  Dependencies,
  Properties,
  Promise<Either<TokenError | RepositoryError, ReturnData>>
>;

export const ValdiateTokenUseCase: ValdiateTokenUseCase =
  ({ tokenRepository, userRepository, tokenValidator, secret }) =>
  async ({ token }) => {
    if (!tokenValidator) {
      tokenValidator = (token, secret) => jwt.verify(token, secret);
    }

    if (!token) {
      return left(new MissingTokenError());
    }

    const tokenIsValid = tokenValidator(token, secret);

    if (!tokenIsValid) {
      return left(new InvalidTokenError());
    }

    const tokenOrError = await tokenRepository.getOne({ jwt: token });

    if (isLeft(tokenOrError)) {
      return left(new InvalidTokenError());
    }

    if (tokenOrError.value.company === undefined) {
      return left(new CompanyNotSetError());
    }

    const userOrError = await userRepository.getOne({
      id: tokenOrError.value.subject,
    });

    if (isLeft(userOrError)) {
      return left(new InvalidTokenError());
    }

    const returnData = {
      user: userOrError.value,
      authToken: tokenOrError.value,
    };

    return right(returnData);
  };
