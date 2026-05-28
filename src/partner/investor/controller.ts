
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvestorService } from './service';

@Controller('partner/investor')
@UseGuards(AuthGuard('jwt'))
export class InvestorController {
    constructor(private readonly investorService: InvestorService) { }

    @Post('send-otp')
    sendOtp(@Body('email') email: string) {
        return this.investorService.sendOtp(email);
    }

    @Post('verify-otp')
    verifyOtp(
        @Body('email') email: string,
        @Body('otp') otp: string,
    ) {
        return this.investorService.verifyOtp(email, otp);
    }

    @Post('complete')
    completeInvestor(@Body() body: any, @Req() req) {
        return this.investorService.completeInvestor(body, req.user);
    }

    @Get()
    findAll(
        @Req() req,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {

        return this.investorService.findAll(
            req.user,
            Number(page),
            Number(limit),
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string,  @Req() req) {
        return this.investorService.findOne(id, req.user);
    }
}
