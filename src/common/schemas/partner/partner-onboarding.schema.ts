import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PartnerOnboardingDocument =
  HydratedDocument<PartnerOnboarding>;

@Schema({ timestamps: true })
export class PartnerOnboarding {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  pincode: string;

  @Prop({ required: true })
  accountHolderName: string;

  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  ifscCode: string;

  @Prop()
  branchName: string;
}

export const PartnerOnboardingSchema =
  SchemaFactory.createForClass(PartnerOnboarding);