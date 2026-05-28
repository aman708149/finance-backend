// partner/register/dto/partner-register.dto.ts
import { IsEmail } from 'class-validator';

export class PartnerRegisterDto {
  @IsEmail()
  email: string;
}
