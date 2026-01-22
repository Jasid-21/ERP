import { IsInt, IsOptional } from 'class-validator';

export class CreateStockDto {
  @IsInt()
  productId!: number;

  @IsInt()
  warehouseId!: number;

  @IsInt()
  amount!: number;

  @IsInt()
  @IsOptional()
  alertMinumum?: number;
}
