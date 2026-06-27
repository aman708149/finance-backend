import { IsString } from 'class-validator';

export class CreateNotificationDto {

    @IsString()
    receiverId: string;

    @IsString()
    title: string;

    @IsString()
    message: string;

}