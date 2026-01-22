import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from './entities/Stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockEntity])],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}
