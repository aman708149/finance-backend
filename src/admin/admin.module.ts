import { Module } from '@nestjs/common';
import { Admin } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminInitializeModule } from './admin-initialize/admin-initialize.module';
import { InvestorModule } from './investor/investor.module';

@Module({
  controllers: [Admin],
  providers: [AdminService],
  imports: [
  
  AdminInitializeModule,
  
  InvestorModule]
})
export class AdminModule { }
