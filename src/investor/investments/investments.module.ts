import { Module } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Investment, InvestmentSchema } from 'src/common/schemas/investment.schema';
import { UserProfile, UserProfileSchema } from 'src/common/schemas/userprofile.schema';
import { User, UserSchema } from 'src/common/schemas/user.schema';



@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Investment.name,
        schema: InvestmentSchema,
      },

      {
        name: UserProfile.name,
        schema: UserProfileSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [InvestmentsController],
  providers: [InvestmentsService],
  exports: [InvestmentsService],
})
export class InvestmentsModule { }