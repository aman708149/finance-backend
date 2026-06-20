import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { Signup, SignupSchema } from 'src/common/schemas/signup.schema';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { UserProfile, UserProfileSchema } from 'src/common/schemas/userprofile.schema';
import { MailerModule } from 'src/mailer/mailer.module';
import { FinanceMailQueueModule } from 'src/queues/finance/finance-mail-queue.module';
import { PartnerOnboarding, PartnerOnboardingSchema } from 'src/common/schemas/partner/partner-onboarding.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Signup.name, schema: SignupSchema },
      { name: User.name, schema: UserSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: PartnerOnboarding.name, schema: PartnerOnboardingSchema },
    ]), FinanceMailQueueModule,
    MailerModule,
  ],
  controllers: [SignupController],
  providers: [SignupService],
})
export class SignupModule { }
