import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// --------------------
// Notifications Schema
// --------------------
@Schema({ _id: false })
export class Notifications {
    @Prop({ default: true })
    email: boolean;

    @Prop({ default: false })
    sms: boolean;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);


// ----------------------
// User Preferences Schema
// ----------------------
export type UserPreferencesDocument = UserPreferences & Document;

@Schema({ timestamps: true })
export class UserPreferences {
    @Prop({ required: true, unique: true })
    userId: string;

    @Prop({ default: 'en' })
    language: string;

    @Prop({ default: 'system' })
    theme: string;

    @Prop({ type: NotificationsSchema, default: {} })
    notifications: Notifications;

    @Prop({ default: 'dashboard' })
    defaultLandingPage: string;

}

export const UserPreferencesSchema = SchemaFactory.createForClass(UserPreferences);
