import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { Employee, User } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { GenericRepository } from 'src/core/data-providers/generic.repository';
import { isLeft } from 'src/core/logic/Either';
import { GenerateAuthTokenUseCase } from 'src/core/usecases/generateauthtoken.usecase';
import { AuthToken } from 'src/core/entities/authtoken.entity';
import { UseCaseInstance } from 'src/core/domain/usecase.entity';
import { GenerateJWTUseCase } from 'src/core/usecases/generatejwt.usecase';
import { Company } from 'src/core/entities/company.entity';
import { Request } from 'express';

class LoginDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

class SetCompanyDTO {
  @IsNumber()
  company: Company['id'];
}

@Controller('/login')
export class LoginController {
  private generateAuthToken: UseCaseInstance<GenerateAuthTokenUseCase>;

  constructor(
    @Inject('UserRepository') private userRepository: GenericRepository<User>,
    @Inject('EmployeeRepository')
    private employeeRepository: GenericRepository<Employee>,
    @Inject('TokenRepository')
    private tokenRepository: GenericRepository<AuthToken>,
  ) {
    // TODO: Get secret from .env
    const generateJWTUseCase = GenerateJWTUseCase({ secret: 'secret' });

    this.generateAuthToken = GenerateAuthTokenUseCase({ generateJWTUseCase });
  }

  @Post()
  async login(@Body() loginDto: LoginDTO) {
    const { username, password: plainPassword } = loginDto;

    const userOrError = await this.userRepository.getOne({ username });

    if (isLeft(userOrError)) {
      return { message: 'User not exists' };
    }

    // TODO: bcrypt password
    // if (!bcrypt.compare(plainPassword, userOrError.value.password))
    if (plainPassword !== userOrError.value.password) {
      return { message: 'Wrong password' };
    }

    const token = this.generateAuthToken({ userId: userOrError.value.id });

    // TODO: specific tokenRepository
    const tokenOrError = await this.tokenRepository.create(token);

    if (isLeft(tokenOrError)) {
      return {
        message: `Cannot create token: ${tokenOrError.value.message}`,
      };
    }

    const userEmployeesOrError = await this.employeeRepository.getAll({
      user: tokenOrError.value.subject,
    });

    if (isLeft(userEmployeesOrError)) {
      return {
        message: `Cannot get employees: ${userEmployeesOrError.value.message}`,
      };
    }

    const userAvailableCompanies = userEmployeesOrError.value.map(
      (employee) => employee.company,
    );

    return { token: tokenOrError.value.jwt, userAvailableCompanies };
  }

  @Post('/set_company')
  async setCompany(@Body() setCompanyDTO: SetCompanyDTO, @Req() req: Request) {
    const { authorization } = req.headers;
    const token = authorization?.split('Bearer ')?.[1];

    if (!token) {
      return { error: 'Invalid token', message: 'Invalid token' };
    }

    const authTokenOrError = await this.tokenRepository.getOne({ jwt: token });

    if (isLeft(authTokenOrError)) {
      return { error: 'Invalid token', message: 'Invalid token' };
    }

    const authToken = authTokenOrError.value;

    const { company } = setCompanyDTO;

    const userEmployeesOrError = await this.employeeRepository.getAll({
      user: authToken.subject,
    });

    if (isLeft(userEmployeesOrError)) {
      return {
        message: `Cannot get employees: ${userEmployeesOrError.value.message}`,
      };
    }

    const userAvailableCompanies = userEmployeesOrError.value.map(
      (employee) => employee.company,
    );

    if (!userAvailableCompanies.includes(company)) {
      return {
        message: `Invalid company`,
      };
    }

    const newToken = this.generateAuthToken({
      userId: authToken.subject,
      company,
    });

    await this.tokenRepository.updateOne({ jwtId: authToken.jwtId }, newToken);

    return { token: newToken.jwt };
  }
}
