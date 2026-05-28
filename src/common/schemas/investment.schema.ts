import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InvestmentDocument = HydratedDocument<Investment>;

export enum InvestmentStatus {
    ACTIVE = 'ACTIVE',
    MATURED = 'MATURED',
    CLOSED = 'CLOSED',
    CANCELLED = 'CANCELLED',
}

@Schema({
    timestamps: true,
})
export class Investment {
    @Prop({
        required: true,
        ref: 'User',
    })
    investorId: string;

    @Prop({
        required: true,
        ref: 'User',
    })
    partnerId: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'UserProfile',
    })
    investorMongoId: Types.ObjectId;


    @Prop({
        required: true,
        min: 1000,
    })
    amount: number;

    @Prop({
        required: true,
    })
    roiPercent: number;

    @Prop({
        required: true,
    })
    durationMonths: number;

    @Prop({
        required: true,
    })
    expectedReturn: number;

    @Prop({
        required: true,
    })
    startDate: Date;

    @Prop({
        required: true,
    })
    maturityDate: Date;

    @Prop({
        enum: InvestmentStatus,
        default: InvestmentStatus.ACTIVE,
    })
    status: InvestmentStatus;

    @Prop()
    remarks: string;
}

export const InvestmentSchema = SchemaFactory.createForClass(Investment);