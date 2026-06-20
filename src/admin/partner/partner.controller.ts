import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PartnerService } from './partner.service';

@Controller('admin/partner')
@UseGuards(AuthGuard('jwt'))
export class PartnerController {
    constructor(
        private readonly partnerService: PartnerService,
    ) { }

    @Get('onboarding')
    getAllOnboardings(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
    ) {
        return this.partnerService.getAllOnboardings(
            Number(page),
            Number(limit),
            search,
        );
    }

    @Get('onboarding/:userId')
    getOnboardingByUserId(
        @Param('userId') userId: string,
    ) {
        return this.partnerService.getOnboardingByUserId(
            userId,
        );
    }

    @Post('onboarding/:userId')
    updateOnboarding(
        @Param('userId') userId: string,
        @Body() body: any,
    ) {
        return this.partnerService.updateOnboarding(
            userId,
            body,
        );
    }
}