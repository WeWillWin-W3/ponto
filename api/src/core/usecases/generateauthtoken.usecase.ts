import { User } from '.prisma/client';
import { randomUUID } from 'crypto';
import { UseCase, UseCaseInstance } from '../domain/usecase.entity';
import { AuthToken, AuthTokenClaims } from '../entities/authtoken.entity';
import { GenerateJWTUseCase } from './generatejwt.usecase';

type Dependencies = {
  uuidGenerator?: () => string;
  defaultIssuer?: string;
  generateJWTUseCase: UseCaseInstance<GenerateJWTUseCase>;
};

type Properties = {
  userId: User['id'];
  issuer?: string;
  company?: AuthTokenClaims['company'];
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
  ({ userId, issuer, company }) => {
    const jwtId = uuidGenerator();
    const issuedAt = Date.now();
    const expirationTime = issuedAt + 2000;

    const authTokenClaims = {
      issuer: issuer ?? defaultIssuer,
      subject: userId,
      audience: defaultIssuer,
      expirationTime,
      issuedAt,
      jwtId,
      company,
    };

    const authToken = {
      ...authTokenClaims,
      jwt: generateJWTUseCase({ claims: authTokenClaims }),
    };

    return authToken;
  };
