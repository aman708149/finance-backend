

import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { InvestorService } from './investor.service';

@Roles(Role.INVESTER)
@Controller('investor')
export class InvestorController {
    constructor(
        private readonly investorService: InvestorService,
    ) { }

    @Get('/preferences/toggle-theme')
    async updateThemePreferences(@Query('theme') theme: string, @Req() req: any, @Res({ passthrough: true }) res: any) {
        const user = req.user;
        return this.investorService.updateThemePreferences(user?.userId, theme, res);
    }

}

