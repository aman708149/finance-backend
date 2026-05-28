import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Role } from "../enums/role.enum";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, enum: Role })
  role: Role;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  rootAdminId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  password: string;

  @Prop()
  refreshToken?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 'active' })
  status: string;
}

export const UserSchema =
  SchemaFactory.createForClass(User);
