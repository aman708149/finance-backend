
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { PartnerService } from './partner.service';

@Roles(Role.PARTNER)
@Controller('partner')
export class PartnerController {
    constructor(
        private readonly partnerService: PartnerService,
    ) { }

    @Get('/preferences/toggle-theme')
    async updateThemePreferences(@Query('theme') theme: string, @Req() req: any, @Res({ passthrough: true }) res: any) {
        const user = req.user;
        return this.partnerService.updateThemePreferences(user?.userId, theme, res);
    }

}
