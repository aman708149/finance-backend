import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

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
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}