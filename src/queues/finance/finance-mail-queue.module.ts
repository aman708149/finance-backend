// src/queues/finance/finance-mail-queue.module.ts

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '../../mailer/mailer.module';
import { FinanceMailQueueService } from './finance-mail-queue.service';
import { FinanceMailQueueProcessor } from './finance-mail-queue.processor';
import { FINANCE_MAIL_QUEUE } from './finance-mail.constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: FINANCE_MAIL_QUEUE,
    }),
    MailerModule,
  ],
  providers: [
    FinanceMailQueueService,
    FinanceMailQueueProcessor,
  ],
  exports: [FinanceMailQueueService],
})
export class FinanceMailQueueModule {}
