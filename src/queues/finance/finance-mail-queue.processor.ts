// src/queues/finance/finance-mail-queue.processor.ts

import { Processor, Process } from '@nestjs/bull';
import bull from 'bull';
import { MailerService } from '../../mailer/mailer.service';
import {
  FINANCE_MAIL_QUEUE,
  FINANCE_MAIL_JOB,
} from './finance-mail.constants';

@Processor(FINANCE_MAIL_QUEUE)
export class FinanceMailQueueProcessor {
  constructor(
    private readonly mailerService: MailerService,
  ) { }

  @Process(FINANCE_MAIL_JOB)
  async handle(job: bull.Job) {
    const { email, subject, html } = job.data;

    await this.mailerService.sendMail({
      email,
      subject,
      html,
    });
  }
}
