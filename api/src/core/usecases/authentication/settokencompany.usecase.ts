import { User } from '../entities/user.entity';
import bcrypt from 'bcrypt';
import {
  GenericRepository,
  RepositoryError,
} from '../data-providers/generic.repository';
import { UseCase, UseCaseInstance } from '../domain/usecase.entity';
import { Either, isLeft, isRight, left, right } from '../logic/Either';
import { GenerateAuthTokenUseCase } from './generateauthtoken.usecase';
import { AuthToken } from '../entities/authtoken.entity';
import { Employee } from '.prisma/client';
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
  passwordComparator?: EncryptedPasswordComparator;
  tokenValidator?: TokenValidator;
  secret: string;
  generateAuthTokenUseCase: UseCaseInstance<GenerateAuthTokenUseCase>;
  tokenRepository: GenericRepository<AuthToken>;
  employeeRepository: GenericRepository<Employee>;
};

type Properties = {
  companyInfo: SetCompany;
  token: AuthToken['jwt'] | undefined;
};

export type SetTokenCompanyUseCase = UseCase<
  Dependencies,
  Properties,
  Promise<Either<Error, AuthToken['jwt']>>
>;

export const SetTokenCompanyUseCase: SetTokenCompanyUseCase =
  ({
    tokenRepository,
    employeeRepository,
    generateAuthTokenUseCase,
    tokenValidator,
    secret,
  }) =>
  async ({ companyInfo, token }) => {
    if (!tokenValidator) {
      tokenValidator = (token, secret) => jwt.verify(token, secret);
    }

    if (!token) {
      const error = new Error('Invalid token');
      error.name = 'Invalid token';

      return left(error);
    }

    const tokenIsValid = tokenValidator(token, secret);

    if (!tokenIsValid) {
      const error = new Error('Invalid token');
      error.name = 'Invalid token';

      return left(error);
    }

    const authTokenOrError = await tokenRepository.getOne({ jwt: token });

    if (isLeft(authTokenOrError)) {
      return authTokenOrError;
    }

    const authToken = authTokenOrError.value;

    const { company } = companyInfo;

    const userEmployeesOrError = await employeeRepository.getAll({
      user: authToken.subject,
    });

    if (isLeft(userEmployeesOrError)) {
      return left(
        new Error(
          `Cannot get employees: ${userEmployeesOrError.value.message}`,
        ),
      );
    }

    const userAvailableCompanies = userEmployeesOrError.value.map(
      (employee) => employee.company,
    );

    if (!userAvailableCompanies.includes(company)) {
      return left(new Error(`Invalid company`));
    }

    const newToken = generateAuthTokenUseCase({
      userId: authToken.subject,
      company,
    });

    await tokenRepository.updateOne({ jwtId: authToken.jwtId }, newToken);

    return right(newToken.jwt);
  };
