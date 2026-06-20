import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "../enums/role.enum";

@Schema({ timestamps: true })
export class UserProfile {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, lowercase: true, index: true })
  email: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  rootAdminId: string;

  @Prop({ required: true })
  role: Role;

  @Prop({ default: false })
  isVerified: boolean

  @Prop()
  fullName: string;

  @Prop()
  department?: string;

  @Prop({ default: 'active' })
  status: string;
}

// 🔥 THIS LINE IS WHAT YOU MISSED
export const UserProfileSchema =
  SchemaFactory.createForClass(UserProfile);
