import { Module } from '@nestjs/common';
import { WarehousesController } from './warehouses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseEntity } from './entities/Warehouse.entity';
import { WarehousesService } from './warehouses.service';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseEntity])],
  providers: [WarehousesService],
  controllers: [WarehousesController],
})
export class WarehousesModule {}
