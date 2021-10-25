import { User } from '.prisma/client';

type UUID = string;

export interface AuthToken {
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
