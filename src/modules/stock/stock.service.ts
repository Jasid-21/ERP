import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockEntity } from './entities/Stock.entity';
import { Repository } from 'typeorm';
import { CreateStockDto } from './dtos/CreateStock.dto';
import { ProductEntity } from '../products/entities/Product.entity';
import { WarehauseEntity } from '../warehouses/entities/Warehause.entity';
import { BaseService } from 'src/commons/classes/BaseService.service';

@Injectable()
export class StockService extends BaseService<StockEntity> {
  constructor(
    @InjectRepository(StockEntity)
    private readonly _stocksRepo: Repository<StockEntity>,
  ) {
    super(_stocksRepo);
  }

  async getStockById(id: number): Promise<StockEntity> {
    if (!id || typeof id != 'number') throw new BadRequestException();

    const stock = await this._stocksRepo.findOneBy({ id });
    if (!stock) throw new NotFoundException();

    return stock;
  }

  async getStockByProductAndWarehouse(
    productId: number,
    warehouseId: number,
  ): Promise<StockEntity> {
    if (!productId || typeof productId != 'number')
      throw new BadRequestException();
    if (!warehouseId || typeof warehouseId != 'number')
      throw new BadRequestException();

    const stock = await this._stocksRepo.findOneBy({ productId, warehouseId });
    if (!stock) throw new NotFoundException();

    return stock;
  }

  async getProductsByWarehouse(warehouseId: number): Promise<ProductEntity[]> {
    if (!warehouseId || typeof warehouseId != 'number')
      throw new BadRequestException();

    const stocks = await this._stocksRepo.findBy({ warehouseId });
    return stocks.map((s) => s.product);
  }

  async getWarehousesByProduct(productId: number): Promise<WarehauseEntity[]> {
    if (!productId || typeof productId != 'number')
      throw new BadRequestException();

    const stock = await this._stocksRepo.findBy({ productId });
    return stock.map((s) => s.warehouse);
  }

  async createStock(dto: CreateStockDto): Promise<StockEntity> {
    try {
      return await this._stocksRepo.save(this._stocksRepo.create(dto));
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  }
}
