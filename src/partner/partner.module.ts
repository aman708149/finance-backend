import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { SignupModule } from './signup/signup.module';
import { InvestorModule } from './investor/module';

@Module({
  controllers: [PartnerController],
  providers: [PartnerService],
  imports: [SignupModule, InvestorModule]
})
export class PartnerModule {}
