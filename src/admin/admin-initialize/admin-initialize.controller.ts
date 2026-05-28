import { Body, Controller, Post } from '@nestjs/common';
import { InitializeAdminService } from './admin-initialize.service';
import { RegisterOtpDto } from './dto/register.dto';
import { AdminSignupDto } from './dto/signup.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('initialize-admin')
export class InitializeAdminController {
  constructor(
    private readonly initializeAdminService: InitializeAdminService,
  ) {}

  /**
   * STEP 1️⃣
   * Send OTP to admin email (FIRST TIME ONLY)
   */
  @Public()
  @Post('register-otp')
  async registerOtp(@Body() dto: RegisterOtpDto) {
    return this.initializeAdminService.registerOtp(dto);
  }

  /**
   * STEP 2️⃣
   * Verify OTP and create Admin
   */
  @Public()
  @Post('signup')
  async signup(@Body() dto: AdminSignupDto) {
    return this.initializeAdminService.signupAdmin(dto);
  }
}
