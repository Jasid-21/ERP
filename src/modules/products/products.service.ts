import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './Entities/Product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { validate } from 'class-validator';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly _productsRepo: Repository<ProductEntity>,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<ProductEntity> {
    if (!dto) throw new BadRequestException();
    const isValid = await validate(dto);
    if (isValid.length) throw new BadRequestException();

    const conflicted = await this._productsRepo.findOne({
      where: { name: dto.name, serial: dto.serial },
    });
    if (conflicted) throw new ConflictException();

    try {
      const rawEntity = this._productsRepo.create(dto);
      const entity = await this._productsRepo.save(rawEntity);

      return entity;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }
}
