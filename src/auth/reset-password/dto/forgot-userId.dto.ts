import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotUserIdDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
