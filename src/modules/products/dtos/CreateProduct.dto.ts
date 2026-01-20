import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { productType } from '../types/productTypes';

export class ICreateProductDto {
  @IsString()
  serial!: string;

  @IsString()
  name!: string;

  @IsEnum(productType)
  type: productType = productType.GOOD;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  measurement?: number;

  @IsString()
  @IsOptional()
  measurementUnit?: string;

  @IsString()
  @IsOptional()
  standardCode?: string;

  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsInt()
  companyId!: number;

  @IsString()
  @IsOptional()
  image?: string;
}
