

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InvestorController } from './investor.controller';
import { InvestorService } from './investor.service';

import {
  UserPreferences,
  UserPreferencesSchema,
} from 'src/common/schemas/userPreferences.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserPreferences.name,
        schema: UserPreferencesSchema,
      },
    ]),
  ],
  controllers: [InvestorController],
  providers: [InvestorService],
})
export class InvestorModule { }
