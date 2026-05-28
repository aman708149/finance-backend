
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvestorService } from './investor.service';

@Controller('admin/investor')
@UseGuards(AuthGuard('jwt'))
export class InvestorController {
    constructor(private readonly investorService: InvestorService) { }

    @Get()
    findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {

        return this.investorService.findAll(
            Number(page),
            Number(limit),
        );
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
    ) {

        return this.investorService.findOne(id);
    }
}
