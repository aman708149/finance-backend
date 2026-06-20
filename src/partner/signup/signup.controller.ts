import { Body, Controller, Post } from '@nestjs/common';
import { SignupService } from './signup.service';
import { CreatePartnerOnboardingDto } from './dto/onboarding.dto';

@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) { }

  @Post('send-otp')
  sendOtp(@Body('email') email: string) {
    return this.signupService.sendOtp(email);
  }

  @Post('verify-otp')
  verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {
    return this.signupService.verifyOtp(email, otp);
  }

  @Post('complete')
  completeSignup(
    @Body() body: {
      email: string;
      password: string;
      fullName: string;
    },
  ) {
    return this.signupService.completeSignup(body);
  }

  @Post('reset-password')
  resetPassword(@Body('email') email: string) {
    return this.signupService.resetPassword(email);
  }

  @Post('partner-onboarding')
  partnerOnboarding(
    @Body() dto: CreatePartnerOnboardingDto,
  ) {
    return this.signupService.partnerOnboarding(dto);
  }

}
