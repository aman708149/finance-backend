import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminModule } from './admin/admin.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { QueuesModule } from './queues/queues.module';
import { MailerModule } from './mailer/mailer.module';
import { PartnerModule } from './partner/partner.module';
import { SignupModule } from './partner/signup/signup.module';
import { InvestorModule } from './investor/investor.module';
import { InvestmentsModule } from './investor/investments/investments.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    // Load .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB connection
    MongooseModule.forRoot(
      process.env.MONGO_URI as string,
    ),

    AdminModule,
    RedisModule,
    AuthModule,
    QueuesModule,
    MailerModule,
    PartnerModule,
    SignupModule,
    InvestorModule,

    // ✅ Add here
    InvestmentsModule,

    SharedModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}