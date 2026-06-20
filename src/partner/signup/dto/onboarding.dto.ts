// create-partner-onboarding.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreatePartnerOnboardingDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  mobileNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pincode: string;

  @IsString()
  accountHolderName: string;

  @IsString()
  bankName: string;

  @IsString()
  accountNumber: string;

  @IsString()
  ifscCode: string;

  @IsString()
  branchName: string;
}