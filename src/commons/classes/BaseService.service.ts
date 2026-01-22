import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseService<T extends { id: number }> {
  protected constructor(protected readonly repo: Repository<T>) {}

  async findById(id: number): Promise<T> {
    const entity = await this.repo.findOneBy({ id } as any);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async updateById(id: number, data: QueryDeepPartialEntity<T>): Promise<T> {
    if (!id || typeof id != 'number') throw new BadRequestException();

    const result = await this.repo.update(id, data);
    if (result.affected === 0) throw new NotFoundException();

    const entity = await this.findById(id);
    if (!entity) throw new NotFoundException();

    return entity;
  }
}
