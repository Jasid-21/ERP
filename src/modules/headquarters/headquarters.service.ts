import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/commons/classes/BaseService.service';
import { HeadquarterEntity } from './entities/Headquarter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHeadquarterDto } from './dtos/CreateHeadquarter.dto';

@Injectable()
export class HeadquartersService extends BaseService<HeadquarterEntity> {
  constructor(
    @InjectRepository(HeadquarterEntity)
    private readonly _headquartersRepo: Repository<HeadquarterEntity>,
  ) {
    super(_headquartersRepo);
  }

  async createHeadquarter(
    dto: CreateHeadquarterDto,
  ): Promise<HeadquarterEntity> {
    const conflicted = await this._headquartersRepo.findOneBy({
      name: dto.name,
      companyId: dto.companyId,
    });
    if (conflicted) throw new ConflictException();

    try {
      const rawEntity = this._headquartersRepo.create(dto);
      const entity = await this._headquartersRepo.save(rawEntity);

      return entity;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteHeadquarterById(id: number) {
    try {
      const result = await this._headquartersRepo.delete({ id });
      if (result.affected === 0) throw new NotFoundException();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
