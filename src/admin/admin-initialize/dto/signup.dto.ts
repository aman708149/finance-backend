import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

import { Type } from "class-transformer";

export class AdminSignupDto {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  prefix: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({}, { message: 'Email OTP must be a number.' })
  emailOtp: number;
}