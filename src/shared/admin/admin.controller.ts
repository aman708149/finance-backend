import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';

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

    @Post('/add-notification')
    async addNotification(
        @Body() dto: CreateNotificationDto,
        @Req() req: any,
    ) {
        return this.adminService.addNotification(
            dto,
            req.user,
        );
    }
}

