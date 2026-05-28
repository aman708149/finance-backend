import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Signup {
  @Prop({ unique: true })
  email: string;

  @Prop()
  otp: string;

  @Prop()
  otpExpiry: Date;

  @Prop({ default: false })
  otpVerified: boolean;

  @Prop()
  prefix: string;
}

export const SignupSchema = SchemaFactory.createForClass(Signup);

SignupSchema.index({ email: 1 }, { unique: true });
SignupSchema.index({ createdAt: -1 });
SignupSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });
