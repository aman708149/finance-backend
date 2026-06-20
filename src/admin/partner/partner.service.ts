import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { PartnerOnboarding, PartnerOnboardingDocument } from 'src/common/schemas/partner/partner-onboarding.schema';

@Injectable()
export class PartnerService {
    constructor(
        @InjectModel(PartnerOnboarding.name)
        private readonly partnerOnboardingModel: Model<PartnerOnboardingDocument>,
    ) { }

    async getAllOnboardings(
        page = 1,
        limit = 10,
        search?: string,
    ) {
        const query: any = {};

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { userId: { $regex: search, $options: 'i' } },
            ];
        }

        const data = await this.partnerOnboardingModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await this.partnerOnboardingModel.countDocuments(query);

        return {
            data,
            total,
            page,
            limit,
        };
    }

    async getOnboardingByUserId(userId: string) {
        const onboarding =
            await this.partnerOnboardingModel.findOne({
                userId,
            });

        if (!onboarding) {
            throw new Error('Onboarding not found');
        }

        return onboarding;
    }

    async updateOnboarding(
        userId: string,
        payload: Partial<PartnerOnboarding>,
    ) {
        const onboarding =
            await this.partnerOnboardingModel.findOneAndUpdate(
                { userId },
                {
                    $set: payload,
                },
                {
                    new: true,
                },
            );

        return {
            success: true,
            message: 'Onboarding updated successfully',
            data: onboarding,
        };
    }
}