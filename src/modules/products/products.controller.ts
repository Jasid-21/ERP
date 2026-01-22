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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { UpdateProductDto } from './dtos/UpdateProduct';
import { JwtAuthGuard } from '../Auth/AuthGuard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProductById(@Param('id') id: number) {
    return this.productsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateProduct(@Body() dto: UpdateProductDto, @Param('id') id: number) {
    return this.productsService.updateById(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteProduct(@Param('id') id: number) {
    return this.productsService.deleteProduct(id);
  }
}
