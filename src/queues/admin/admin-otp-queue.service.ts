import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import bull from 'bull';
import {
  ADMIN_OTP_QUEUE,
  SEND_ADMIN_OTP_EMAIL,
} from './admin-otp.constants';

@Injectable()
export class AdminOtpQueueService {
  constructor(
    @InjectQueue(ADMIN_OTP_QUEUE)
    private readonly adminOtpQueue: bull.Queue,
  ) { }

  // ✅ Common helper (same pattern as WalletMailQueueService)
  private async addToQueue(
    jobName: string,
    jobData: any,
    attempts = 3,
  ) {
    return this.adminOtpQueue.add(jobName, jobData, {
      attempts,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: 10,
      removeOnFail: 10,
    });
  }

  // ✅ Only enqueue data
  async sendAdminOtpEmail(data: {
    email: string;
    subject: string;
    data: {
      title: string;
      otp: string;
      validityPeriod: number;
      COMPANY_NAME: string;
    };
  }) {
    const job = await this.addToQueue(
      SEND_ADMIN_OTP_EMAIL,
      data,
      5,
    );

    console.log('✅ Admin OTP Job added:', job.id);
    return job;
  }

}
