// import { Module } from '@nestjs/common';
// import { BullModule } from '@nestjs/bull';
// import { AdminOtpQueueService } from './admin-otp-queue.service';
// import { AdminOtpQueueProcessor } from './admin-otp-queue.processor';
// import { ADMIN_OTP_QUEUE } from './admin-otp.constants';

// @Module({
//   imports: [
//     BullModule.registerQueue({
//       name: ADMIN_OTP_QUEUE,
//     }),
//   ],
//   providers: [AdminOtpQueueService, AdminOtpQueueProcessor],
//   exports: [AdminOtpQueueService],
// })
// export class AdminOtpQueueModule {}

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ADMIN_OTP_QUEUE } from './admin-otp.constants';

import { AdminOtpQueueService } from './admin-otp-queue.service';
import { AdminOtpQueueProcessor } from './admin-otp-queue.processor';
import { MailerModule } from 'src/mailer/mailer.module'; // 👈 ADD THIS

@Module({
  imports: [
    BullModule.registerQueue({
      name: ADMIN_OTP_QUEUE,
    }),

    MailerModule, // 🔥 THIS LINE FIXES EVERYTHING
  ],
  providers: [
    AdminOtpQueueService,
    AdminOtpQueueProcessor,
  ],
  exports: [AdminOtpQueueService],
})
export class AdminOtpQueueModule { }

