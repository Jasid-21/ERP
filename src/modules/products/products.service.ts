import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/Product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { BaseService } from 'src/commons/classes/BaseService.service';

@Injectable()
export class ProductsService extends BaseService<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly _productsRepo: Repository<ProductEntity>,
  ) {
    super(_productsRepo);
  }

  async createProduct(dto: CreateProductDto): Promise<ProductEntity> {
    if (!dto) throw new BadRequestException();

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
      throw err;
    }
  }

  async deleteProduct(id: number): Promise<void> {
    if (!id) throw new BadRequestException();

    const result = await this._productsRepo.delete({ id });
    if (result.affected === 0) throw new NotFoundException();
  }
}
