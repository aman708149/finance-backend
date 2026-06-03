import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Roles(Role.ADMIN)
@Controller('admin/preferences')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) { }

    @Get('toggle-theme')
    async updateThemePreferences(@Query('theme') theme: string, @Req() req: any, @Res({ passthrough: true }) res: any) {
        const user = req.user;
        return this.adminService.updateThemePreferences(user?.userId, theme, res);
    }

}
