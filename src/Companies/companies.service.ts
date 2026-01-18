import { Injectable } from '@nestjs/common';
import { INewCompanyDto } from './types/newCompany.dto';
import { MatchObj, MatchProperty } from 'src/utils/MatchObj.class';

@Injectable()
export class CompaniesService {
  create(dto: INewCompanyDto) {
    const comparator = new MatchObj(
      new MatchProperty('name', ['string']),
      new MatchProperty('nit', ['string']),
      new MatchProperty('rut', ['string']),
      new MatchProperty('digitalCertificate', ['string']),
    );

    const isDtoCorrect = comparator.compare(dto);
    return isDtoCorrect;
  }
}
