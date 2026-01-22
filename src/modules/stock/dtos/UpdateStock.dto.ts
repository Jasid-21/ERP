import { IsInt, IsOptional } from 'class-validator';

export class UpdateStockDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  @IsOptional()
  productId!: number;

  @IsInt()
  @IsOptional()
  warehouseId!: number;

  @IsInt()
  @IsOptional()
  amount?: number;

  @IsInt()
  @IsOptional()
  alertMinumum?: number;
}
