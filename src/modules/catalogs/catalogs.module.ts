import { Module } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogEntity } from './entities/Catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogEntity])],
  providers: [CatalogsService],
  controllers: [CatalogsController],
})
export class CatalogsModule {}
