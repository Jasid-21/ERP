import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { productType } from '../types/productTypes';

export class UpdateProductDto {
  @IsString()
  serial!: string;

  @IsString()
  name!: string;

  @IsEnum(productType)
  type!: productType;

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

  @IsString()
  @IsOptional()
  image?: string;
}
