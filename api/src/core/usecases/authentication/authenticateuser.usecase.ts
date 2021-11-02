import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  GenericRepository,
  RepositoryError,
} from '../../data-providers/generic.repository';
import { UseCase, UseCaseInstance } from '../../domain/usecase.entity';
import { Either, isLeft, left, right } from '../../logic/Either';
import { GenerateAuthTokenUseCase } from './generateauthtoken.usecase';
import { AuthToken } from '../../entities/authtoken.entity';
import { Employee } from '.prisma/client';
import { Company } from '../../entities/company.entity';
import {
  AuthenticationError,
  InvalidUserError,
  WrongPasswordError,
} from '../errors/authentication.error';

export interface AuthenticateUser extends Pick<User, 'email' | 'password'> {}

type EncryptedPasswordComparator = (
  plainPassword: string,
  encryptedPassword: string,
) => boolean;

type Dependencies = {
  passwordComparator?: EncryptedPasswordComparator;
  generateAuthTokenUseCase: UseCaseInstance<GenerateAuthTokenUseCase>;
  userRepository: GenericRepository<User>;
  tokenRepository: GenericRepository<AuthToken>;
  employeeRepository: GenericRepository<Employee>;
};

type Properties = {
  userData: AuthenticateUser;
};

type ReturnData = {
  token: AuthToken['jwt'];
  userAvailableCompanies: Company['id'][];
};

export type AuthenticateUserUseCase = UseCase<
  Dependencies,
  Properties,
  Promise<Either<AuthenticationError | RepositoryError, ReturnData>>
>;

export const AuthenticateUserUseCase: AuthenticateUserUseCase =
  ({
    passwordComparator = (plain, encrypted) =>
      bcrypt.compareSync(plain, encrypted),
    userRepository,
    tokenRepository,
    employeeRepository,
    generateAuthTokenUseCase,
  }) =>
  async ({ userData }) => {
    const { email, password: plainPassword } = userData;

    const userOrError = await userRepository.getOne({ email });

    if (isLeft(userOrError)) {
      return left(new InvalidUserError('User not exists'));
    }

    if (!passwordComparator(plainPassword, userOrError.value.password)) {
      return left(new WrongPasswordError('Wrong password'));
    }

    const token = generateAuthTokenUseCase({ userId: userOrError.value.id });

    const tokenOrError = await tokenRepository.create(token);

    if (isLeft(tokenOrError)) {
      return tokenOrError;
    }

    const userEmployeesOrError = await employeeRepository.getAll({
      user: tokenOrError.value.subject,
    });

    if (isLeft(userEmployeesOrError)) {
      return userEmployeesOrError;
    }

    const userAvailableCompanies = userEmployeesOrError.value.map(
      (employee) => employee.company,
    );

    const returnData: ReturnData = {
      token: tokenOrError.value.jwt,
      userAvailableCompanies,
    };

    return right(returnData);
  };
