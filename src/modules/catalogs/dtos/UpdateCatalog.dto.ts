import { IsInt, IsNumber } from 'class-validator';

export class UpdateCatalogDto {
  @IsInt()
  productId!: number;

  @IsNumber()
  salePrice!: number;

  @IsInt()
  headQuarterId!: number;
}
