// import { Module } from '@nestjs/common';
// import { InitializeAdminService } from './admin-initialize.service';
// import { InitializeAdminController } from './admin-initialize.controller';

// @Module({
//   controllers: [InitializeAdminController],
//   providers: [InitializeAdminService]
// })
// export class AdminInitializeModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InitializeAdminService } from './admin-initialize.service';
import { InitializeAdminController } from './admin-initialize.controller';
import { Signup, SignupSchema } from 'src/common/schemas/signup.schema';

import { RedisModule } from 'src/redis/redis.module';
import { AdminOtpQueueModule } from 'src/queues/admin/admin-otp-queue.module';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { UserProfile, UserProfileSchema } from 'src/common/schemas/userprofile.schema';

@Module({
  imports: [
    // 🔥 REQUIRED for @InjectModel()
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: Signup.name, schema: SignupSchema },
    ]),

    // 🔥 REQUIRED for RedisService
    RedisModule,
    AdminInitializeModule,
    // 🔥 REQUIRED for AdminOtpQueueService
    AdminOtpQueueModule,
  ],
  controllers: [InitializeAdminController],
  providers: [InitializeAdminService],
})
export class AdminInitializeModule { }

