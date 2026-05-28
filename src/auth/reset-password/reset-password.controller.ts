import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { ResetPasswordService } from './reset-password.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotUserIdDto } from './dto/forgot-userId.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class ResetPasswordController {
  constructor(
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  // 📧 Forgot password
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.resetPasswordService.forgotPassword(dto);
  }

  // 👤 Forgot username
  @Post('forgot-username')
  forgotUserName(@Body() dto: ForgotUserIdDto) {
    return this.resetPasswordService.forgotUserName(dto);
  }

  // 🔐 Validate reset token
  @Post('validate-reset-token')
  validateResetToken(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token required');
    }
    return this.resetPasswordService.validateResetToken(token);
  }

  // 🔑 Reset password
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordService.resetPassword(dto);
  }
}
