import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';

@Controller('investments')
export class InvestmentsController {
  constructor(
    private readonly investmentsService: InvestmentsService,
  ) {}

  @Post('create')
  create(
    @Body() createInvestmentDto: CreateInvestmentDto,
  ) {
    return this.investmentsService.create(
      createInvestmentDto,
    );
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.investmentsService.findAll(
      Number(page),
      Number(limit),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentsService.findOne(id);
  }
}