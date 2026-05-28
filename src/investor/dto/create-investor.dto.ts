import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateInvestorDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  fullName: string;

  @MinLength(6)
  password: string;
}