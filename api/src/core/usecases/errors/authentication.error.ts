import { UseCaseError } from 'src/core/domain/errors/usecase.error';

export interface AuthenticationError extends UseCaseError {}

export class DuplicatedEmailError extends Error implements AuthenticationError {
  name = 'DuplicatedEmailError';

  constructor(message: string = 'E-mail already exists') {
    super(message);
  }
}

export class InvalidUserError extends Error implements AuthenticationError {
  name = 'InvalidUserError';

  constructor(message: string) {
    super(message);
  }
}

export class InvalidCompanyError extends Error implements AuthenticationError {
  name = 'InvalidCompanyError';

  constructor(message: string = "This company aren't valid for this") {
    super(message);
  }
}

export class WrongPasswordError extends Error implements AuthenticationError {
  name = 'WrongPasswordError';

  constructor(message: string) {
    super(message);
  }
}
