import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) { }

    @Get('/preferences/toggle-theme')
    async updateThemePreferences(@Query('theme') theme: string, @Req() req: any, @Res({ passthrough: true }) res: any) {
        const user = req.user;
        return this.adminService.updateThemePreferences(user?.userId, theme, res);
    }

}
