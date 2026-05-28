import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';

import { User, UserSchema } from 'src/common/schemas/user.schema';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FinanceMailQueueModule } from 'src/queues/finance/finance-mail-queue.module';

@Module({
  imports: [
    ConfigModule, // ⭐ important

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),

    FinanceMailQueueModule,
  ],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
})
export class ResetPasswordModule {}