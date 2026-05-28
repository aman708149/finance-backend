import {
  Body,
  Controller,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('investor')
@UseGuards(AuthGuard('jwt'))
export class InvestorController {
 
}