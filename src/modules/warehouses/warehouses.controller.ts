import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateWarehauseDto } from './dtos/createWarehause.dto';
import { JwtAuthGuard } from '../Auth/AuthGuard';
import { WarehousesService } from './warehouses.service';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createWarehause(@Body() dto: CreateWarehauseDto) {
    return this.warehousesService.createWarehause(dto);
  }
}
