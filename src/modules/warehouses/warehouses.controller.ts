import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateWarehauseDto } from './dtos/createWarehause.dto';
import { JwtAuthGuard } from '../Auth/AuthGuard';
import { WarehousesService } from './warehouses.service';
import { UpdateWarehouseDto } from './dtos/UpdateWarehouse.dto';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get(':id')
  getWarehouseById(@Param('id') id: number) {
    return this.warehousesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createWarehause(@Body() dto: CreateWarehauseDto) {
    return this.warehousesService.createWarehause(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateWarehouse(@Body() dto: UpdateWarehouseDto, @Param('id') id: number) {
    return this.warehousesService.updateById(id, dto);
  }

  @Delete(':id')
  deleteWarehouse(@Param('id') id: number) {
    return this.warehousesService.deleteWarehouse(Number(id));
  }
}
