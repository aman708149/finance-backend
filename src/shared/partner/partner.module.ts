
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  UserPreferences,
  UserPreferencesSchema,
} from 'src/common/schemas/userPreferences.schema';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserPreferences.name,
        schema: UserPreferencesSchema,
      },
    ]),
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule { }
