import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateInvestmentDto {
  
  @IsString()
  @IsNotEmpty()
  investorId: string;

  @IsString()
  @IsNotEmpty()
  partnerId: string;

  @IsNumber()
  @Min(1000)
  amount: number;

  @IsNumber()
  roiPercent: number;

  @IsNumber()
  durationMonths: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}