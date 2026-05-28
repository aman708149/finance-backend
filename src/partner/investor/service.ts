
import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Signup } from 'src/common/schemas/signup.schema';
import { User } from 'src/common/schemas/user.schema';
import { UserProfile } from 'src/common/schemas/userprofile.schema';
import { Role } from 'src/common/enums/role.enum';
import { FinanceMailQueueService } from 'src/queues/finance/finance-mail-queue.service';
import { Investment, InvestmentDocument } from 'src/common/schemas/investment.schema';

@Injectable()
export class InvestorService {
    constructor(
        @InjectModel(Signup.name)
        private signupModel: Model<Signup>,

        @InjectModel(User.name)
        private userModel: Model<User>,

        @InjectModel(UserProfile.name)
        private userProfileModel: Model<UserProfile>,

        @InjectModel(Investment.name)
        private investmentModel: Model<InvestmentDocument>,

        private readonly financeMailQueueService: FinanceMailQueueService,
    ) { }

    // 🔹 SEND OTP TO INVESTOR EMAIL
    async sendOtp(email: string) {
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser)
            throw new BadRequestException('User already exists');

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
            subject: 'Investor OTP Verification',
            html: `<h3>Your OTP is <b>${otp}</b></h3>`,
        });

        return { message: 'OTP sent successfully' };
    }

    // 🔹 VERIFY OTP
    async verifyOtp(email: string, otp: string) {
        const record = await this.signupModel.findOne({ email });

        if (!record)
            throw new BadRequestException('Record not found');

        if (record.otp !== otp)
            throw new BadRequestException('Invalid OTP');

        if (record.otpExpiry < new Date())
            throw new BadRequestException('OTP expired');

        record.otpVerified = true;
        await record.save();

        return { message: 'OTP verified successfully' };
    }

    // 🔹 COMPLETE INVESTOR CREATION
    async completeInvestor(data: any, partner: any) {

        if (!partner?.userId || !partner?.rootAdminId) {
            throw new BadRequestException('Invalid partner token');
        }

        const signup = await this.signupModel.findOne({
            email: data.email,
        });

        if (!signup || !signup.otpVerified)
            throw new BadRequestException('OTP not verified');

        const userId = `INV${Date.now()}`;

        const hashedPassword = await bcrypt.hash(data.password, 10);

        await this.userModel.create({
            userId,
            email: data.email,
            password: hashedPassword,
            role: Role.INVESTER,
            ownerId: partner.userId,
            rootAdminId: partner.rootAdminId,
        });

        await this.userProfileModel.create({
            userId,
            email: data.email,
            fullName: data.fullName,
            role: Role.INVESTER,
            ownerId: partner.userId,
            rootAdminId: partner.rootAdminId,
        });

        return {
            message: 'Investor created successfully',
            userId,
        };
    }

    async findAll(
        partner: any,
        page = 1,
        limit = 10,
    ) {

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([

            this.investmentModel

                .find({
                    partnerId: partner.userId,
                })

                .populate({
                    path: 'investorId',
                    localField: 'investorId',
                    foreignField: 'userId',
                    model: 'User',
                    justOne: true,
                    select: 'userId ownerId',
                })

                .populate({
                    path: 'partnerId',
                    localField: 'partnerId',
                    foreignField: 'userId',
                    model: 'User',
                    justOne: true,
                    select: 'userId ownerId',
                })

                .sort({ createdAt: -1 })

                .skip(skip)

                .limit(limit),

            this.investmentModel.countDocuments({
                partnerId: partner.userId,
            }),
        ]);

        return {
            success: true,
            total,
            page,
            limit,
            data,
        };
    }

    async findOne
        (
            id: string,
            partner: any,
        ) {

        const investment =
            await this.investmentModel

                .findById({
                    _id: id,
                    partnerId: partner.userId,

                })
                .populate({
                    path: 'investorId',
                    localField: 'investorId',
                    foreignField: 'userId',
                    model: 'User',
                    justOne: true,

                    select: 'userId ownerId',
                })

                .populate({
                    path: 'partnerId',
                    localField: 'partnerId',
                    foreignField: 'userId',
                    model: 'User',
                    justOne: true,

                    select: 'userId ownerId',
                });

        if (!investment) {

            throw new NotFoundException(
                'Investment not found',
            );
        }

        return {
            success: true,
            data: investment,
        };
    }
}
