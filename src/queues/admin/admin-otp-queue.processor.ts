import { Processor, Process } from '@nestjs/bull';
import bull from 'bull';
import {
  ADMIN_OTP_QUEUE,
  SEND_ADMIN_OTP_EMAIL,
} from './admin-otp.constants';
import { MailerService } from 'src/mailer/mailer.service';

@Processor(ADMIN_OTP_QUEUE)
export class AdminOtpQueueProcessor {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  @Process(SEND_ADMIN_OTP_EMAIL)
  async handleSendOtp(
    job: bull.Job<{
      email: string;
      subject: string;
      data: {
        otp: string;
        COMPANY_NAME: string;
        validityPeriod: number;
      };
    }>,
  ) {
    const {
      email,
      subject,
      data: { otp, COMPANY_NAME, validityPeriod },
    } = job.data;

    console.log('📧 Processing admin OTP email for:', email);

    const html = `
      <h2>${COMPANY_NAME}</h2>
      <p>Your Admin OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for ${validityPeriod} minutes.</p>
    `;

    await this.mailerService.sendMail({
      email,          // ✅ matches your MailerService type
      subject,
      html,
    });

    console.log('✅ Admin OTP email sent:', email);
  }
}
