import { ConflictException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/commons/classes/BaseService.service';
import { CatalogEntity } from './entities/Catalog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatalogDto } from './dtos/CreateCatalog.dto';

@Injectable()
export class CatalogsService extends BaseService<CatalogEntity> {
  constructor(
    @InjectRepository(CatalogEntity)
    private readonly _catalogsRepo: Repository<CatalogEntity>,
  ) {
    super(_catalogsRepo);
  }

  async create(dto: CreateCatalogDto): Promise<CatalogEntity> {
    const conflicted = await this._catalogsRepo.findOneBy({
      productId: dto.productId,
      headquarterId: dto.headQuarterId,
    });
    if (conflicted) throw new ConflictException();

    try {
      const rawEntity = this._catalogsRepo.create(dto);
      const entity = await this._catalogsRepo.save(rawEntity);

      return entity;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
