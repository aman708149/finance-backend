import { Module } from '@nestjs/common';
import { SharedController } from './shared.controller';
import { SharedService } from './shared.service';
import { AdminModule } from './admin/admin.module';
import { PartnerModule } from './partner/partner.module';
import { InvestorModule } from './investor/investor.module';

@Module({
  controllers: [SharedController],
  providers: [SharedService],
  imports: [AdminModule, PartnerModule, InvestorModule]
})
export class SharedModule {}
