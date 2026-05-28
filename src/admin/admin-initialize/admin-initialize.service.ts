import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Signup } from 'src/common/schemas/signup.schema';
import { RedisService } from 'src/redis/redis.service';
import { RegisterOtpDto } from './dto/register.dto';
import { AdminSignupDto } from './dto/signup.dto';
import { UserStatus } from 'src/auth/decorators/userStatus.enum';
import { User } from 'src/common/schemas/user.schema';
import { UserProfile } from 'src/common/schemas/userprofile.schema';
import { Role } from 'src/common/enums/role.enum';
import { AdminOtpQueueService } from 'src/queues/admin/admin-otp-queue.service';

@Injectable()
export class InitializeAdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfile>,
    @InjectModel(Signup.name)
    private readonly signupModel: Model<Signup>,
    @InjectConnection() private readonly connection: Connection,
    private readonly redisService: RedisService,
    private readonly adminOtpQueueService: AdminOtpQueueService,
  ) {}

  /**
   * STEP 1️⃣
   * Send Email OTP (Redis)
   * ONLY if Super Admin does NOT exist
   */
  async registerOtp(dto: RegisterOtpDto) {
    const { email } = dto;

    // 🔒 ONLY ONE SUPER ADMIN ALLOWED
    const superAdminExists = await this.userModel.exists({
      role: Role.SUPER_ADMIN,
    });

    if (superAdminExists) {
      throw new BadRequestException('Super Admin already initialized');
    }

    let signup = await this.signupModel.findOne({ email });

    if (signup?.otpVerified) {
      throw new BadRequestException('Super Admin already registered');
    }

    if (!signup) {
      signup = await this.signupModel.create({
        email,
        otpVerified: false,
      });
    }

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const redisKey = `super-admin:init:otp:${email}`;

    // ⏱ Store OTP for 10 minutes
    await this.redisService.set(
      redisKey,
      JSON.stringify({ otp }),
      600,
    );

    // 📧 Send Email
    await this.adminOtpQueueService.sendAdminOtpEmail({
      email,
      subject: 'Super Admin Initialization OTP',
      data: {
        title: 'System Initialization',
        otp,
        validityPeriod: 10,
        COMPANY_NAME: process.env.COMPANY_NAME || '',
      },
    });

    return {
      status: 'success',
      message: 'OTP sent to email',
    };
  }

  /**
   * STEP 2️⃣
   * Verify OTP & Create Super Admin
   */
  async signupAdmin(dto: AdminSignupDto) {
    const { email, emailOtp, prefix } = dto;

    const redisKey = `super-admin:init:otp:${email}`;
    const redisData = await this.redisService.get(redisKey);

    if (!redisData) {
      throw new BadRequestException('OTP expired');
    }

    const { otp } = JSON.parse(redisData);

    if (Number(otp) !== Number(emailOtp)) {
      throw new BadRequestException('Invalid OTP');
    }

    // 🔥 OTP validated → delete Redis key
    await this.redisService.del(redisKey);

    const signup = await this.signupModel.findOne({ email });
    if (!signup || signup.otpVerified) {
      throw new BadRequestException('Invalid signup request');
    }

    // 🔒 DOUBLE CHECK (race-condition safe)
    const superAdminExists = await this.userModel.exists({
      role: Role.SUPER_ADMIN,
    });

    if (superAdminExists) {
      throw new ConflictException('Super Admin already exists');
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const userId = `${prefix}000001`;

      // 👑 CREATE SUPER ADMIN USER
      await this.userModel.create(
        [
          {
            userId,
            email,
            role: Role.SUPER_ADMIN,
            ownerId: 'SYSTEM',
            rootAdminId: userId,
            status: UserStatus.Active,
          },
        ],
        { session },
      );

      // 👤 CREATE PROFILE
      await this.userProfileModel.create(
        [
          {
            userId,
            email,
            role: Role.SUPER_ADMIN,
            ownerId: 'SYSTEM',
            rootAdminId: userId,
            status: UserStatus.Active,
          },
        ],
        { session },
      );

      // ✅ Mark signup verified
      signup.otpVerified = true;
      signup.prefix = prefix;
      await signup.save({ session });

      await session.commitTransaction();

      return {
        status: 'success',
        message: 'Super Admin initialized successfully',
        data: { userId },
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
