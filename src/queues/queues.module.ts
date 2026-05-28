import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { AdminOtpQueueModule } from './admin/admin-otp-queue.module';
import { FinanceMailQueueModule } from './finance/finance-mail-queue.module';

@Global()
@Module({
  imports: [
    ConfigModule,

    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),

    AdminOtpQueueModule,

    FinanceMailQueueModule,
  ],
  exports: [AdminOtpQueueModule, FinanceMailQueueModule,],
})
export class QueuesModule {}
