import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/user.schema';

import { JwtStrategy } from './strategies/jwt.strategy';
import { FinanceMailQueueModule } from 'src/queues/finance/finance-mail-queue.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResetPasswordModule } from './reset-password/reset-password.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,  
    ResetPasswordModule, // ⭐ important

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),

    FinanceMailQueueModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}