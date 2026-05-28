import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
    Investment,
    InvestmentDocument,
} from 'src/common/schemas/investment.schema';

@Injectable()
export class InvestorService {

    constructor(

        @InjectModel(Investment.name)
        private investmentModel:
            Model<InvestmentDocument>,

    ) { }

    // ✅ ADMIN GET ALL INVESTMENTS
    async findAll(
        page = 1,
        limit = 10,
    ) {

        const skip = (page - 1) * limit;

        const [data, total] =
            await Promise.all([

                this.investmentModel

                    .find()

                    .populate({
                        path: 'investorId',
                        localField: 'investorId',
                        foreignField: 'userId',
                        model: 'User',
                        justOne: true,

                        select:
                            'userId ownerId',
                    })

                    .populate({
                        path: 'partnerId',
                        localField: 'partnerId',
                        foreignField: 'userId',
                        model: 'User',
                        justOne: true,

                        select:
                            'userId ownerId',
                    })

                    .sort({
                        createdAt: -1,
                    })

                    .skip(skip)

                    .limit(limit),

                this.investmentModel
                    .countDocuments(),
            ]);

        return {

            success: true,
            total,
            page,
            limit,
            data,
        };
    }

    // ✅ ADMIN GET SINGLE INVESTMENT
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

                    select:
                        'userId ownerId',
                })

                .populate({
                    path: 'partnerId',
                    localField: 'partnerId',
                    foreignField: 'userId',
                    model: 'User',
                    justOne: true,

                    select:
                        'userId ownerId',
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