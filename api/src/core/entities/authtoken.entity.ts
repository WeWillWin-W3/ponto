import { User } from '.prisma/client';
import { Company } from './company.entity';

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

  company?: Company['id'];
}

export interface AuthToken extends AuthTokenClaims {
  jwt: string;
}
