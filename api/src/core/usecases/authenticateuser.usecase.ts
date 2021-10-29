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

export interface AuthenticateUser extends Pick<User, 'email' | 'password'> {}

type EncryptedPasswordComparator = (
  encryptedPassword: string,
  plainPassword: string,
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
  Promise<Either<Error, ReturnData>>
>;

export const AuthenticateUserUseCase: AuthenticateUserUseCase =
  ({
    passwordComparator = (encrypted, plain) =>
      bcrypt.compareSync(encrypted, plain),
    userRepository,
    tokenRepository,
    employeeRepository,
    generateAuthTokenUseCase,
  }) =>
  async ({ userData }) => {
    const { email, password: plainPassword } = userData;

    const userOrError = await userRepository.getOne({ email });

    if (isLeft(userOrError)) {
      return left(new Error('User not exists'));
    }

    if (!passwordComparator(userOrError.value.password, plainPassword)) {
      return left(new Error('Wrong password'));
    }

    const token = generateAuthTokenUseCase({ userId: userOrError.value.id });

    const tokenOrError = await tokenRepository.create(token);

    if (isLeft(tokenOrError)) {
      return left(
        new Error(`Cannot create token: ${tokenOrError.value.message}`),
      );
    }

    const userEmployeesOrError = await employeeRepository.getAll({
      user: tokenOrError.value.subject,
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

    const returnData: ReturnData = {
      token: tokenOrError.value.jwt,
      userAvailableCompanies,
    };

    return right(returnData);
  };
