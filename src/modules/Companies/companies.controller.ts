import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { NewCompanyDto } from './dtos/NewCompany.dto';
import { IUpdateCompanyDto } from './types/UpdateCompany.dto';
import { JwtAuthGuard } from '../Auth/AuthGuard';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createCompany(@Body() dto: NewCompanyDto) {
    return this.companiesService.createCompany(dto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateCompany(@Body() dto: IUpdateCompanyDto) {
    return this.companiesService.updateCompany(dto);
  }
}
