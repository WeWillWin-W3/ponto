import { UseCase } from '../domain/usecase.entity';
import * as jwt from 'jsonwebtoken';
import { AuthTokenClaims } from '../entities/authtoken.entity';

type Dependencies = {
  jwtSigner?: (
    payload: any,
    key: string,
    options?: { expiresIn?: string | number },
  ) => string;
  secret: string;
};

type Properties = {
  claims: AuthTokenClaims;
};

export type GenerateJWTUseCase = UseCase<Dependencies, Properties, string>;

export const GenerateJWTUseCase: GenerateJWTUseCase =
  ({ jwtSigner = jwt.sign, secret }) =>
  ({ claims }) => {
    const {
      issuer: iss,
      subject: sub,
      audience: aud,
      issuedAt: iat,
      jwtId: jti,
      expirationTime: expiresIn,
      ...aditionalData
    } = claims;

    const payload = {
      ...aditionalData,
      iss,
      sub,
      aud,
      iat,
      jti,
    };

    const options = {
      expiresIn,
    };

    return jwtSigner(payload, secret, options);
  };
