import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { NewCompanyDto } from './dtos/NewCompany.dto';
import { CompanyEntity } from './entities/Company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { BaseService } from 'src/commons/classes/BaseService.service';

@Injectable()
export class CompaniesService extends BaseService<CompanyEntity> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly _companiesRepo: Repository<CompanyEntity>,
  ) {
    super(_companiesRepo);
  }

  async createCompany(dto: NewCompanyDto): Promise<CompanyEntity> {
    if (!dto) throw new BadRequestException();
    if ((await validate(dto)).length) throw new BadRequestException();

    const found = await this._companiesRepo.findOne({
      where: { nit: dto.nit, rut: dto.rut },
    });
    if (found) throw new ConflictException();

    const rawEntity = this._companiesRepo.create({
      name: dto.name,
      nit: dto.nit,
      rut: dto.rut,
    });
    try {
      const company = await this._companiesRepo.save(rawEntity);
      return company;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
