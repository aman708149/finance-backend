import { UserProfile } from 'src/common/schemas/userprofile.schema';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';



import { CreateInvestmentDto } from './dto/create-investment.dto';
import { Investment, InvestmentDocument, InvestmentStatus } from 'src/common/schemas/investment.schema';

@Injectable()
export class InvestmentsService {
    constructor(
        @InjectModel(Investment.name)
        private investmentModel: Model<InvestmentDocument>,

        @InjectModel(UserProfile.name)
        private userProfileModel:
            Model<UserProfile>,
    ) { }

    async create(createInvestmentDto: CreateInvestmentDto) {

        const {
            investorId,
            partnerId,
            amount,
            roiPercent,
            durationMonths,
        } = createInvestmentDto;

        // ✅ Find investor
        const investor =
            await this.userProfileModel.findOne({
                userId: investorId,
                role: 'invester',
            });

        if (!investor) {

            throw new NotFoundException(
                'Investor not found',
            );
        }

        // ✅ Validate partner ownership
        if (investor.ownerId !== partnerId) {

            throw new BadRequestException(
                'Invalid partner for this investor',
            );
        }

        // ✅ ROI Calculation
        const expectedReturn =
            amount +
            (amount * roiPercent * durationMonths)
            / (12 * 100);

        // ✅ Dates
        const startDate = new Date();

        const maturityDate = new Date();

        maturityDate.setMonth(
            maturityDate.getMonth()
            + durationMonths,
        );

        // ✅ Create investment
        const investment =
            await this.investmentModel.create({

                ...createInvestmentDto,

                investorMongoId: investor._id,

                expectedReturn,

                startDate,

                maturityDate,

                status: InvestmentStatus.ACTIVE,
            });

        return {
            success: true,
            message:
                'Investment created successfully',
            data: investment,
        };
    }

    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.investmentModel
                .find()
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

            this.investmentModel.countDocuments(),
        ]);

        return {
            success: true,
            total,
            page,
            limit,
            data,
        };
    }

    async findOne(id: string) {

        const investment =
            await this.investmentModel

                .findById(id)

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