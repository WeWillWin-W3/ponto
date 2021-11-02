import { UseCaseError } from 'src/core/domain/errors/usecase.error';

export interface TokenError extends UseCaseError {}

export class MissingTokenError extends Error implements TokenError {
  name = 'MissingTokenError';

  constructor(message: string = 'Token not found') {
    super(message);
  }
}

export class InvalidTokenError extends Error implements TokenError {
  name = 'InvalidTokenError';

  constructor(message: string = 'Invalid token') {
    super(message);
  }
}

export class CompanyNotSetError extends Error implements TokenError {
  name = 'CompanyNotSetError';

  constructor(message: string = 'A company must be defined in the token') {
    super(message);
  }
}
