import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from 'src/common/schemas/user.schema';
import { FinanceMailQueueService } from 'src/queues/finance/finance-mail-queue.service';

import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotUserIdDto } from './dto/forgot-userId.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private readonly jwtService: JwtService,
    private readonly mailQueue: FinanceMailQueueService,
  ) { }

  // 📧 Forgot password
  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });

      // production safe → do not reveal user existence
      if (!user) return { message: 'If email exists, mail sent' };

      const token = this.jwtService.sign(
        { sub: user.userId },
        { expiresIn: '15m' },
      );

      await this.mailQueue.sendMail({
        email: user.email,
        subject: 'Reset Password',
        html: `
          <p>Click below link to reset your password:</p>

           <a href="http://10.50.0.104:3003/reset-password?token=${token}">
           Reset Password
            </a>
           `,
      });

      return { message: 'If email exists, mail sent' };
    } catch {
      throw new InternalServerErrorException('Failed to process request');
    }
  }

  // 👤 Forgot username
  async forgotUserName(dto: ForgotUserIdDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });

      if (!user) return { message: 'User not found to this email, go to register' };

      await this.mailQueue.sendMail({
        email: user.email,
        subject: 'Your Username',
        html: `Your username is: ${user.userId}`,
      });

      return { message: 'If email exists, then sent to username in your register email' };
    } catch {
      throw new InternalServerErrorException('Failed to process request');
    }
  }

  // 🔐 Validate reset token
  async validateResetToken(token: string) {
    try {
      this.jwtService.verify(token);
      return { valid: true };
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  // 🔑 Reset password
  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(dto.token);

      const user = await this.userModel.findOne({
        userId: payload.sub,
      });

      if (!user) throw new BadRequestException('Invalid token');

      user.password = await bcrypt.hash(dto.password, 10);
      await user.save();

      return { message: 'Password updated successfully' };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;

      throw new BadRequestException('Invalid or expired token');
    }
  }
}