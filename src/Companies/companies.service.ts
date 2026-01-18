import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { INewCompanyDto } from './types/newCompany.dto';
import { MatchObj, MatchProperty } from 'src/utils/MatchObj.class';
import { CompanyEntity } from './entities/Company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUpdateCompanyDto } from './types/UpdateCompany.dto';
import { removeObjectProperties } from 'src/utils/RemoveObjProperties';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly _companiesRepo: Repository<CompanyEntity>,
  ) {}

  async createCompany(
    dto: INewCompanyDto,
    userId: number,
  ): Promise<CompanyEntity> {
    if (!dto || !userId) throw new BadRequestException();

    const comparator = new MatchObj(
      new MatchProperty('name', ['string']),
      new MatchProperty('nit', ['string']),
      new MatchProperty('rut', ['string']),
    );
    if (!comparator.compare(dto)) throw new BadRequestException();

    const found = await this._companiesRepo.findOne({
      where: { nit: dto.nit, rut: dto.rut },
    });
    if (found) throw new ConflictException();

    const rawEntity = this._companiesRepo.create({
      name: dto.name,
      nit: dto.nit,
      rut: dto.rut,
      createdBy: userId,
    });
    try {
      const company = await this._companiesRepo.save(rawEntity);
      return company;
    } catch (err) {
      console.error(err);
      throw new BadRequestException();
    }
  }

  async updateCompany(
    dto: IUpdateCompanyDto,
    userId: number,
  ): Promise<CompanyEntity> {
    if (!dto || !userId) throw new BadRequestException();

    const comparator = new MatchObj(
      new MatchProperty('id', [1]),
      new MatchProperty('name', ['string'], false),
      new MatchProperty('nit', ['string'], false),
      new MatchProperty('rut', ['string'], false),
    );
    if (!comparator.compare(dto, true)) throw new BadRequestException();
    const result = await this._companiesRepo.update(dto.id, {
      ...removeObjectProperties(dto, ['id']),
      updatedBy: userId,
    });
    if (result.affected === 0) throw new NotFoundException();

    const updatedCompany = await this._companiesRepo.findOneBy({ id: dto.id });
    if (!updatedCompany) throw new NotFoundException();

    return updatedCompany;
  }
}
