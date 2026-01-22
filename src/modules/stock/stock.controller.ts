import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dtos/CreateStock.dto';
import { UpdateAmountDto } from './dtos/UpdateAmount.dto';
import { UpdateAlertMinimumDto } from './dtos/UpdateAlertMinimum.dto';
import { JwtAuthGuard } from '../Auth/AuthGuard';

@Controller('stock')
export class StockController {
  constructor(private readonly stocksService: StockService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getStockById(@Param('id') id: number) {
    return this.stocksService.getStockById(id);
  }

  @Get('productsByWarehouse/:warehouseId')
  @UseGuards(JwtAuthGuard)
  getProductsByWarehouse(@Param('warehouseId') warehouseId: number) {
    return this.stocksService.getProductsByWarehouse(warehouseId);
  }

  @Get('warehousesByProduct/:productId')
  @UseGuards(JwtAuthGuard)
  getWarehousesByProduct(@Param('productId') productId: number) {
    return this.stocksService.getWarehousesByProduct(productId);
  }

  @Get('stockByProductAndWarehouse/:productId/:warehouseId')
  @UseGuards(JwtAuthGuard)
  getStockByProductAndWarehouse(
    @Param('productId') productId: number,
    @Param('warehouseId') warehouseId: number,
  ) {
    return this.stocksService.getStockByProductAndWarehouse(
      productId,
      warehouseId,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createStock(@Body() dto: CreateStockDto) {
    return this.stocksService.createStock(dto);
  }

  @Put('updateAmount/:id')
  @UseGuards(JwtAuthGuard)
  updateAmount(@Body() dto: UpdateAmountDto, @Param('id') id: number) {
    const { amount } = dto;
    if (amount < 0) throw new BadRequestException('Amount cannot be negative');

    return this.stocksService.updateById(id, dto);
  }

  @Put('updateAlertMinumum')
  @UseGuards(JwtAuthGuard)
  updateAlertMinumum(
    @Body() dto: UpdateAlertMinimumDto,
    @Param('id') id: number,
  ) {
    const { alertMinimum } = dto;
    if (alertMinimum < 0)
      throw new BadRequestException('Amount cannot be negative');

    return this.stocksService.updateById(id, dto);
  }
}
