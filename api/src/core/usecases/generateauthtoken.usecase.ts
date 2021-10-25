import { User } from '.prisma/client';
import { randomUUID } from 'crypto';
import { AuthToken } from '../entities/AuthToken';

type GenerateAuthTokenDeps = {
  uuidGenerator?: () => string;
};

type GenerateAuthTokenProps = {
  user: User;
  issuer?: string;
};

const defaultIssuer = 'ponto.w3.io';

export const GenerateAuthTokenUseCase =
  ({ uuidGenerator = randomUUID }: GenerateAuthTokenDeps) =>
  ({ user, issuer }: GenerateAuthTokenProps): AuthToken => {
    const jwtId = uuidGenerator();
    const issuedAt = Date.now();

    return {
      issuer: issuer ?? defaultIssuer,
      subject: user.id,
      audience: defaultIssuer,
      expirationTime: issuedAt + 2000,
      issuedAt,
      jwtId,
    };
  };
