import { User } from '.prisma/client';

type UUID = string;

export interface AuthTokenClaims {
  // iss
  issuer: string;
  // sub
  subject: User['id'];
  // aud
  audience: string;
  // exp
  expirationTime: number;
  // iat
  issuedAt: number;
  // jti
  jwtId: UUID;
}

export interface AuthToken extends AuthTokenClaims {
  jwt: string;
}
