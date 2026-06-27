import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import {
  UserPreferences,
  UserPreferencesSchema,
} from 'src/common/schemas/userPreferences.schema';

import {
  Notification,
  NotificationSchema,
} from 'src/common/schemas/notification.schema';

import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    SocketModule, // <-- Add this

    MongooseModule.forFeature([
      {
        name: UserPreferences.name,
        schema: UserPreferencesSchema,
      },
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }