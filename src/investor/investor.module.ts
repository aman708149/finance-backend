import { Module } from '@nestjs/common';
import { InvestorController } from './investor.controller';
import { InvestorService } from './investor.service';
import { InvestmentsModule } from './investments/investments.module';

@Module({
  imports: [
   InvestmentsModule],
  controllers: [InvestorController],
  providers: [InvestorService], // ✅ ONLY THIS
})
export class InvestorModule { }