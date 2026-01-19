import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './Entities/Product.entity';
import { Repository } from 'typeorm';
import { ICreateProductDto } from './dtos/CreateProduct.dto';
import { MatchObj, MatchProperty } from 'src/utils/MatchObj.class';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly _productsRepo: Repository<ProductEntity>,
  ) {}

  async createProduct(dto: ICreateProductDto): Promise<ProductEntity> {
    if (!dto) throw new BadRequestException();
    const comparator = new MatchObj(
      new MatchProperty('serial', ['string']),
      new MatchProperty('name', ['string']),
      new MatchProperty('type', ['string']),
      new MatchProperty('description', ['string'], false),
      new MatchProperty('measurement', [1], false),
      new MatchProperty('measurement_unit', ['string'], false),
      new MatchProperty('standardCode', ['string'], false),
      new MatchProperty('basePrice', [1], false),
      new MatchProperty('companyId', [1]),
      new MatchProperty('image', ['string'], false),
    );
    if (!comparator.compare(dto, true)) throw new BadRequestException();


  }
}
