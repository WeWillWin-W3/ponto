import { User } from '../entities/user.entity';
import bcrypt from 'bcrypt';
import {
  GenericRepository,
  RepositoryError,
} from '../data-providers/generic.repository';
import { UseCase } from '../domain/usecase.entity';
import { Either, isRight, left } from '../logic/Either';

export interface CreateUser {
  name: string;
  email: string;
  password: string;
}

type PasswordEncrypter = (
  plainPassword: string,
  options: { saltRounds: number },
) => string;

type Dependencies = {
  passwordEncrypter?: PasswordEncrypter;
  saltRounds?: number;
  adminCompanyDomain?: string;
  userRepository: GenericRepository<User>;
};

type Properties = {
  userData: CreateUser;
};

interface UserValidationError {
  message: string;
}

export type CreateUserUseCase = UseCase<
  Dependencies,
  Properties,
  Promise<Either<UserValidationError | RepositoryError, User>>
>;

export const CreateUserUseCase: CreateUserUseCase =
  ({
    passwordEncrypter,
    saltRounds = 2,
    userRepository,
    adminCompanyDomain = 'w3.com',
  }) =>
  async ({ userData }) => {
    if (!passwordEncrypter) {
      passwordEncrypter = (
        plainPassword: string,
        options: { saltRounds: number },
      ) => bcrypt.hashSync(plainPassword, options.saltRounds);
    }

    // E-mail and password format validation
    // Responsibility delegated to controller

    const sameEmailUser = await userRepository.getOne({
      email: userData.email,
    });

    if (isRight(sameEmailUser)) {
      return left(new Error());
    }

    const encryptedPassword = passwordEncrypter(userData.password, {
      saltRounds,
    });

    const userHasAdminRole = new RegExp(`${adminCompanyDomain}$`).test(
      userData.email,
    );

    const user_role = userHasAdminRole ? 'admin' : 'basic';

    const user: Omit<User, 'id'> = {
      email: userData.email,
      password: encryptedPassword,
      user_role,
    };

    const createUserResult = await userRepository.create(user);

    return createUserResult;
  };
