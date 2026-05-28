import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterOtpDto {
  // @IsNotEmpty({ message: 'Phone number is required.' })
  // @IsString({ message: 'Phone number must be a valid string.' })
  // @MinLength(10, { message: 'Phone number must be 10 digits long.' })
  // @MaxLength(10, { message: 'Phone number must be 10 digits long.' })
  // phone: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsString({ message: 'Email must be a valid string.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;
}
