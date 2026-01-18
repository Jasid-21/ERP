import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { INewCompanyDto } from './types/newCompany.dto';
import { IUpdateCompanyDto } from './types/UpdateCompany.dto';
import { IAuthRequest } from 'src/Auth/AuthInterfaces';
import { JwtAuthGuard } from 'src/Auth/AuthGuard';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createCompany(@Body() dto: INewCompanyDto, @Req() req: IAuthRequest) {
    return this.companiesService.createCompany(dto, req.user.id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateCompany(@Body() dto: IUpdateCompanyDto, @Req() req: IAuthRequest) {
    return this.companiesService.updateCompany(dto, req.user.id);
  }
}
