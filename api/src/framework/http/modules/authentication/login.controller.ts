import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { mapLeft } from 'src/core/logic/Either';
import { GenerateAuthTokenUseCase } from 'src/core/usecases/generateauthtoken.usecase';
import { AuthToken } from 'src/core/entities/authtoken.entity';
import { UseCaseInstance } from 'src/core/domain/usecase.entity';
import { GenerateJWTUseCase } from 'src/core/usecases/generatejwt.usecase';
import { Company } from 'src/core/entities/company.entity';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticateUser,
  AuthenticateUserUseCase,
} from 'src/core/usecases/authenticateuser.usecase';
import { User } from 'src/core/entities/user.entity';
import {
  SetCompany,
  SetTokenCompanyUseCase,
} from 'src/core/usecases/settokencompany.usecase';

class LoginDTO implements AuthenticateUser {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

class SetCompanyDTO implements SetCompany {
  @IsNumber()
  company: Company['id'];
}

@Controller('/login')
export class LoginController {
  private authenticateUser: UseCaseInstance<AuthenticateUserUseCase>;
  private setTokenCompany: UseCaseInstance<SetTokenCompanyUseCase>;

  constructor(
    @Inject('UserRepository') private userRepository: GenericRepository<User>,
    @Inject('EmployeeRepository')
    private employeeRepository: GenericRepository<Employee>,
    @Inject('TokenRepository')
    private tokenRepository: GenericRepository<AuthToken>,
    private configService: ConfigService,
  ) {
    const secret = this.configService.get<string>('JWT_SECRET');
    const generateJWTUseCase = GenerateJWTUseCase({ secret });
    const generateAuthToken = GenerateAuthTokenUseCase({ generateJWTUseCase });

    this.authenticateUser = AuthenticateUserUseCase({
      generateAuthTokenUseCase: generateAuthToken,
      userRepository: this.userRepository,
      tokenRepository: this.tokenRepository,
      employeeRepository: this.employeeRepository,
    });

    this.setTokenCompany = SetTokenCompanyUseCase({
      employeeRepository: this.employeeRepository,
      tokenRepository: this.tokenRepository,
      generateAuthTokenUseCase: generateAuthToken,
    });
  }

  @Post()
  async login(@Body() loginDto: LoginDTO) {
    const resultOrError = await this.authenticateUser({ userData: loginDto });

    const resultOrErrorMessage = mapLeft(resultOrError, (err) => ({
      message: err.message,
      error: err.name,
    }));

    return resultOrErrorMessage;
  }

  @Post('/set_company')
  async setCompany(@Body() setCompanyDTO: SetCompanyDTO, @Req() req: Request) {
    const { authorization } = req.headers;
    const token = authorization?.split('Bearer ')?.[1];

    const resultOrError = await this.setTokenCompany({
      token,
      companyInfo: setCompanyDTO,
    });

    const resultOrErrorMessage = mapLeft(resultOrError, (err) => ({
      message: err.message,
      error: err.name,
    }));

    return resultOrErrorMessage;
  }
}
