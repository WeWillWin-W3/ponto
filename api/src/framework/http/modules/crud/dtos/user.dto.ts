import { User } from '@prisma/client';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto implements Partial<User> {}

export class UpdateUserDto implements Partial<User> {}
