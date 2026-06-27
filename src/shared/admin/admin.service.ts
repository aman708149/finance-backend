import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from 'src/common/schemas/notification.schema';
import { UserPreferences, UserPreferencesDocument } from 'src/common/schemas/userPreferences.schema';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(UserPreferences.name)
        private userPreferencesModel: Model<UserPreferencesDocument>,

        @InjectModel(Notification.name)
        private notificationModal: Model<NotificationDocument>,

        private readonly socketGateway: SocketGateway,
    ) { }


    async updateThemePreferences(userId: string, theme: string, res: any) {
        const userPreferences = await this.userPreferencesModel.findOneAndUpdate({ userId }, { theme }, { new: true, upsert: true });

        if (userPreferences) {
            await this.setCookiePreferences(res, userPreferences.theme);
            return userPreferences;
        }
        // 🔥 VERY IMPORTANT
        throw new BadGatewayException('User preferences not found');
    }

    async setCookiePreferences(res: any, theme: string) {
        console.log('Setting theme cookie:', theme);
        res.cookie('theme', theme, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            path: '/',
            sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
            domain: process.env.NODE_ENV === 'development' ? undefined : process.env.COOKIE_DOMAIN,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        });
    }

    async addNotification(body: any, adminId: string) {
        try {

            const notification = await this.notificationModal.create({
                receiverId: body.receiverId,
                title: body.title,
                message: body.message,
                isRead: false,
                createdBy: adminId,
            });

            this.socketGateway.sendNotification(
                body.receiverId,
                notification,
            );

            return {
                success: true,
                message: 'Notification sent successfully.',
                data: notification,
            };

        } catch (error) {
            throw new BadGatewayException(error.message);
        }
    }
}
