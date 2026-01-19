import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WarehauseEntity } from './entities/Warehause.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWarehauseDto } from './dtos/createWarehause.dto';
import { MatchObj, MatchProperty } from 'src/utils/MatchObj.class';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(WarehauseEntity)
    private readonly _warehousesRepo: Repository<WarehauseEntity>,
  ) {}

  async getWarehauseById(id: number): Promise<WarehauseEntity> {
    if (!id || typeof id != 'number') throw new BadRequestException();

    const warehause = await this._warehousesRepo.findOneBy({ id });
    if (!warehause) throw new NotFoundException();

    return warehause;
  }

  async createWarehause(dto: CreateWarehauseDto): Promise<WarehauseEntity> {
    if (!dto) throw new BadRequestException();
    const comparator = new MatchObj(
      new MatchProperty('name', ['string']),
      new MatchProperty('description', ['string']),
      new MatchProperty('companyId', [1]),
    );
    if (!comparator.compare(dto)) throw new BadRequestException();

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
}
