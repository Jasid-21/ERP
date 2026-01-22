import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { NewCompanyDto } from './dtos/NewCompany.dto';
import { IUpdateCompanyDto } from './types/UpdateCompany.dto';
import { JwtAuthGuard } from '../Auth/AuthGuard';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':id')
  getCompanyById(@Param('id') id: number) {
    return this.companiesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createCompany(@Body() dto: NewCompanyDto) {
    return this.companiesService.createCompany(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateCompany(@Body() dto: IUpdateCompanyDto, @Param('id') id: number) {
    return this.companiesService.updateById(id, dto);
  }
}
