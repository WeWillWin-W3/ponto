import { User } from '../entities/user.entity';
import { GenericRepository } from '../data-providers/generic.repository';
import { UseCase } from '../domain/usecase.entity';
import { Either, isLeft, left, right } from '../logic/Either';
import { AuthToken } from '../entities/authtoken.entity';
import { Company } from '../entities/company.entity';
import * as jwt from 'jsonwebtoken';

export interface SetCompany {
  company: Company['id'];
}

type EncryptedPasswordComparator = (
  encryptedPassword: string,
  plainPassword: string,
) => boolean;

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
  Promise<Either<Error, ReturnData>>
>;

export const ValdiateTokenUseCase: ValdiateTokenUseCase =
  ({ tokenRepository, userRepository, tokenValidator, secret }) =>
  async ({ token }) => {
    if (!tokenValidator) {
      tokenValidator = (token, secret) => jwt.verify(token, secret);
    }

    if (!token) {
      const error = new Error('Token not found');
      error.name = 'Missing token';

      return left(error);
    }

    const tokenIsValid = tokenValidator(token, secret);

    if (!tokenIsValid) {
      const error = new Error('Invalid token');
      error.name = 'Invalid token';

      return left(error);
    }

    const tokenOrError = await tokenRepository.getOne({ jwt: token });

    if (isLeft(tokenOrError)) {
      const error = new Error('Invalid token');
      error.name = 'Invalid token';

      return left(error);
    }

    if (tokenOrError.value.company === undefined) {
      const error = new Error('An user token must company ....');
      error.name = 'Invalid token';

      return left(error);
    }

    const userOrError = await userRepository.getOne({
      id: tokenOrError.value.subject,
    });

    if (isLeft(userOrError)) {
      const error = new Error('Invalid token');
      error.name = 'Invalid token';

      return left(error);
    }

    const returnData = {
      user: userOrError.value,
      authToken: tokenOrError.value,
    };

    return right(returnData);
  };
