import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { User, UserDocument } from 'src/common/schemas/user.schema';
import { FinanceMailQueueService } from 'src/queues/finance/finance-mail-queue.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private readonly jwtService: JwtService,
    private readonly mailQueue: FinanceMailQueueService,
  ) { }

  // 🔐 Generate Tokens
  private async generateTokens(user: UserDocument) {
    try {
      const payload = {
        sub: user.userId,
        userId: user.userId,
        role: user.role,
        email: user.email,
        isVerified: user.isVerified,
        ownerId: user.ownerId,
        rootAdminId: user.rootAdminId
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      return { accessToken, refreshToken };
    } catch (err) {
      throw new InternalServerErrorException('Token generation failed');
    }
  }

  // 🔐 LOGIN
  async login(dto: LoginDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const match = await bcrypt.compare(dto.password, user.password);

      if (!match) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const tokens = await this.generateTokens(user);

      user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
      await user.save();

      return tokens;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;

      throw new InternalServerErrorException('Login failed');
    }
  }

  // 🔄 REFRESH
  async refresh(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken);

      const user = await this.userModel.findOne({
        userId: payload.sub,
      });

      if (!user) throw new UnauthorizedException();

      const match = await bcrypt.compare(
        dto.refreshToken,
        user.refreshToken || '',
      );

      if (!match) throw new UnauthorizedException();

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // 🚪 LOGOUT
  async logout(userId: string) {
    try {
      const user = await this.userModel.findOne({ userId });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      await this.userModel.updateOne(
        { userId },
        { $unset: { refreshToken: 1 } },
      );

      return { message: 'Logged out successfully' };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;

      throw new InternalServerErrorException('Logout failed');
    }
  }
}