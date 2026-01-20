import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewCompanyDto } from './dtos/NewCompany.dto';
import { CompanyEntity } from './entities/Company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUpdateCompanyDto } from './types/UpdateCompany.dto';
import { removeObjectProperties } from 'src/utils/RemoveObjProperties';
import { validate } from 'class-validator';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly _companiesRepo: Repository<CompanyEntity>,
  ) {}

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
      throw new BadRequestException();
    }
  }

  async updateCompany(dto: IUpdateCompanyDto): Promise<CompanyEntity> {
    if (!dto) throw new BadRequestException();
    if ((await validate(dto)).length) throw new BadRequestException();

    const company = await this._companiesRepo.findOneBy({ id: dto.id });
    if (!company) throw new NotFoundException();

    Object.assign(company, removeObjectProperties(dto, ['id']));
    const updatedCompany = await this._companiesRepo.save(company);

    return updatedCompany;
  }
}
