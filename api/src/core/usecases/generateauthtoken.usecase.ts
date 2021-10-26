import { User } from '.prisma/client';
import { randomUUID } from 'crypto';
import { UseCase, UseCaseInstance } from '../domain/usecase.entity';
import { AuthToken } from '../entities/authtoken.entity';
import { GenerateJWTUseCase } from './generatejwt.usecase';

type Dependencies = {
  uuidGenerator?: () => string;
  defaultIssuer?: string;
  generateJWTUseCase: UseCaseInstance<GenerateJWTUseCase>;
};

type Properties = {
  user: User;
  issuer?: string;
};

export type GenerateAuthTokenUseCase = UseCase<
  Dependencies,
  Properties,
  AuthToken
>;

export const GenerateAuthTokenUseCase: GenerateAuthTokenUseCase =
  ({
    uuidGenerator = randomUUID,
    defaultIssuer = 'ponto.w3.io',
    generateJWTUseCase,
  }) =>
  ({ user, issuer }) => {
    const jwtId = uuidGenerator();
    const issuedAt = Date.now();
    const expirationTime = issuedAt + 2000;

    const authTokenClaims = {
      issuer: issuer ?? defaultIssuer,
      subject: user.id,
      audience: defaultIssuer,
      expirationTime,
      issuedAt,
      jwtId,
    };

    const authToken = {
      ...authTokenClaims,
      jwt: generateJWTUseCase({ claims: authTokenClaims }),
    };

    return authToken;
  };
