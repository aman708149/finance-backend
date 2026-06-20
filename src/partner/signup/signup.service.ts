import {
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Signup } from 'src/common/schemas/signup.schema';
import { User } from 'src/common/schemas/user.schema';
import { UserProfile } from 'src/common/schemas/userprofile.schema';
import { Role } from 'src/common/enums/role.enum';
import { FinanceMailQueueService } from 'src/queues/finance/finance-mail-queue.service';
import { CreatePartnerOnboardingDto } from './dto/onboarding.dto';
import { PartnerOnboarding, PartnerOnboardingDocument } from 'src/common/schemas/partner/partner-onboarding.schema';

@Injectable()
export class SignupService {
    constructor(
        @InjectModel(Signup.name)
        private signupModel: Model<Signup>,

        @InjectModel(User.name)
        private userModel: Model<User>,

        @InjectModel(UserProfile.name)
        private userProfileModel: Model<UserProfile>,

        @InjectModel(PartnerOnboarding.name)
        private partnerOnboardingModel: Model<PartnerOnboardingDocument>,

        private readonly financeMailQueueService: FinanceMailQueueService,

    ) { }

    // 🔹 SEND OTP
    async sendOtp(email: string) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 10);

        await this.signupModel.findOneAndUpdate(
            { email },
            {
                email,
                otp,
                otpExpiry: expiry,
                otpVerified: false,
            },
            { upsert: true, new: true },
        );

        await this.financeMailQueueService.sendMail({
            email,
            subject: 'Your OTP Code',
            html: `<h3>Your OTP is <b>${otp}</b></h3>`,
        });


        return { message: 'OTP sent successfully' };
    }

    // 🔹 VERIFY OTP
    async verifyOtp(email: string, otp: string) {
        const record = await this.signupModel.findOne({ email });

        if (!record)
            throw new BadRequestException('Signup not found');

        if (record.otp !== otp)
            throw new BadRequestException('Invalid OTP');

        if (record.otpExpiry < new Date())
            throw new BadRequestException('OTP expired');

        record.otpVerified = true;
        await record.save();

        return { message: 'OTP verified successfully' };
    }

    // 🔹 GENERATE UNIQUE USER ID
    private async generateUserId(): Promise<string> {
        const random = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        const timestamp = Date.now().toString().slice(-4);

        return `PT${timestamp}${random}`;
    }

    // 🔹 COMPLETE SIGNUP
    async completeSignup(data: {
        email: string;
        password: string;
        fullName: string;
    }) {
        const signup = await this.signupModel.findOne({
            email: data.email,
        });

        if (!signup || !signup.otpVerified)
            throw new BadRequestException(
                'OTP not verified',
            );

        const existingUser = await this.userModel.findOne({
            email: data.email,
        });

        if (existingUser)
            throw new BadRequestException(
                'User already exists',
            );

        const userId = await this.generateUserId();

        const hashedPassword = await bcrypt.hash(
            data.password,
            10,
        );

        await this.userModel.create({
            userId,
            email: data.email,
            password: hashedPassword,
            role: Role.PARTNER,
            ownerId: userId,
            rootAdminId: 'SUPERADMIN001',
        });

        await this.userProfileModel.create({
            userId,
            email: data.email,
            fullName: data.fullName,
            role: Role.PARTNER,
            ownerId: userId,
            rootAdminId: 'SUPERADMIN001',
        });

        return {
            message: 'Signup completed successfully',
            userId,
        };
    }

    // 🔹 RESET PASSWORD
    async resetPassword(email: string) {
        const user = await this.userModel.findOne({
            email,
        });

        if (!user)
            throw new BadRequestException(
                'User not found',
            );

        const newPassword = Math.random()
            .toString(36)
            .slice(-8);

        user.password = await bcrypt.hash(
            newPassword,
            10,
        );

        await user.save();

        await this.financeMailQueueService.sendMail({
            email,
            subject: 'Password Reset',
            html: `<h3>Your new password: <b>${newPassword}</b></h3>`,
        });

        return { message: 'New password sent to email' };
    }

    async partnerOnboarding(
        dto: CreatePartnerOnboardingDto,
    ) {
        const user = await this.userModel.findOne({
            email: dto.email,
        });

        if (!user) {
            throw new BadRequestException('User not found, Fill Your Register Email Id');
        }

        const existing =
            await this.partnerOnboardingModel.findOne({
                userId: user.userId,
            });

        if (existing) {
            throw new BadRequestException(
                'Onboarding already completed',
            );
        }

        await this.partnerOnboardingModel.create({
            userId: user.userId,
            ...dto,
        });

        await this.userModel.updateOne(
            { userId: user.userId },
            {
                $set: {
                    phone: dto.mobileNumber,
                },
            },
        );

        await this.userProfileModel.updateOne(
            { userId: user.userId },
            {
                $set: {
                    fullName: dto.fullName,
                    isVerified: true,
                },
            },
        );

        return {
            success: true,
            message:
                'Partner onboarding completed successfully',
        };
    }
}
