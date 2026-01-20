import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './Entities/Product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { validate } from 'class-validator';
import { UpdateProductDto } from './dtos/UpdateProduct';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly _productsRepo: Repository<ProductEntity>,
  ) {}

  async getProductById(id: number): Promise<ProductEntity> {
    if (!id || typeof id != 'number') throw new BadRequestException();

    const product = await this._productsRepo.findOneBy({ id });
    if (!product) throw new NotFoundException();

    return product;
  }

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

  async updateProduct(dto: UpdateProductDto): Promise<ProductEntity> {
    if (!dto) throw new BadRequestException();
    if ((await validate(dto)).length) throw new BadRequestException();

    const product = await this._productsRepo.findOneBy({ id: dto.id });
    if (!product) throw new NotFoundException();

    Object.assign(product, dto);
    try {
      const updatedProduct = await this._productsRepo.save(product);
      return updatedProduct;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }

  async deleteProduct(id: number): Promise<void> {
    if (!id) throw new BadRequestException();

    const result = await this._productsRepo.delete({ id });
    if (result.affected === 0) throw new NotFoundException();
  }
}
