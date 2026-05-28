// src/queues/finance/finance-mail-queue.service.ts

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import bull from 'bull';
import {
  FINANCE_MAIL_QUEUE,
  FINANCE_MAIL_JOB,
} from './finance-mail.constants';

@Injectable()
export class FinanceMailQueueService {
  constructor(
    @InjectQueue(FINANCE_MAIL_QUEUE)
    private readonly financeQueue: bull.Queue,
  ) { }

  async sendMail(data: {
    email: string;
    subject: string;
    html: string;
  }) {
    
    await this.financeQueue.add(FINANCE_MAIL_JOB, data, {
      attempts: 3,
      backoff: 5000,
      removeOnComplete: 10,
      removeOnFail: 10,
    });
  }
}
