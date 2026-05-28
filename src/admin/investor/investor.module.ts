
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'src/common/schemas/user.schema';
import { UserProfile, UserProfileSchema } from 'src/common/schemas/userprofile.schema';
import { Signup, SignupSchema } from 'src/common/schemas/signup.schema';
import { Investment, InvestmentSchema } from 'src/common/schemas/investment.schema';
import { InvestorController } from './investor.controller';
import { InvestorService } from './investor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Signup.name, schema: SignupSchema },
      { name: User.name, schema: UserSchema },
      { name: UserProfile.name, schema: UserProfileSchema },
      {
        name: Investment.name,
        schema: InvestmentSchema,
      },
    ]),
  ],
  controllers: [InvestorController],
  providers: [InvestorService], // ✅ ONLY THIS
})
export class InvestorModule { }

