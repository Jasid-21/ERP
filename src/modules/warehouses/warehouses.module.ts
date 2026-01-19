import { Module } from '@nestjs/common';
import { WarehousesController } from './warehouses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehauseEntity } from './entities/Warehause.entity';
import { WarehousesService } from './warehouses.service';

@Module({
  imports: [TypeOrmModule.forFeature([WarehauseEntity])],
  providers: [WarehousesService],
  controllers: [WarehousesController],
})
export class WarehousesModule {}
