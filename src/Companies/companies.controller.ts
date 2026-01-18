import { Body, Controller, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { INewCompanyDto } from './types/newCompany.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() dto: INewCompanyDto) {
    return this.companiesService.create(dto);
  }
}
