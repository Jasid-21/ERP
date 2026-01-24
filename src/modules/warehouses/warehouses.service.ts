import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WarehouseEntity } from './entities/Warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWarehauseDto } from './dtos/createWarehause.dto';
import { validate } from 'class-validator';
import { BaseService } from 'src/commons/classes/BaseService.service';

@Injectable()
export class WarehousesService extends BaseService<WarehouseEntity> {
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly _warehousesRepo: Repository<WarehouseEntity>,
  ) {
    super(_warehousesRepo);
  }

  async createWarehause(dto: CreateWarehauseDto): Promise<WarehouseEntity> {
    if (!dto) throw new BadRequestException();
    if ((await validate(dto)).length) throw new BadRequestException();

    //Verificar si existe un almacén con el mismo nombre para esa empresa.
    const conflicted = await this._warehousesRepo.findOneBy({
      name: dto.name,
      companyId: dto.companyId,
    });
    if (conflicted) throw new ConflictException();

    const rawWarehause = this._warehousesRepo.create({
      ...dto,
    });
    console.log(rawWarehause);
    const warehause = await this._warehousesRepo.save(rawWarehause);

    return warehause;
  }

  async deleteWarehouse(id: number) {
    if (!id || typeof id != 'number') throw new BadRequestException();

    const result = await this._warehousesRepo.delete({ id });
    if (result.affected === 0) throw new NotFoundException();
  }
}
