import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { FinanceMailQueueModule } from 'src/queues/finance/finance-mail-queue.module';
import { PartnerOnboarding, PartnerOnboardingSchema } from 'src/common/schemas/partner/partner-onboarding.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { UserProfile, UserProfileSchema } from 'src/common/schemas/userprofile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PartnerOnboarding.name, schema: PartnerOnboardingSchema },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserProfile.name,
        schema: UserProfileSchema,
      },
    ]), FinanceMailQueueModule,
    MailerModule,
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule { }
