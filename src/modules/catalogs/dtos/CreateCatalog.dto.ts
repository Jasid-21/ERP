import { IsInt, IsNumber } from 'class-validator';

export class CreateCatalogDto {
  @IsInt()
  productId!: number;

  @IsNumber()
  salePrice!: number;

  @IsInt()
  headQuarterId!: number;

  @IsInt()
  companyId!: number;
}
