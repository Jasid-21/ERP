import { IsOptional, IsString } from 'class-validator';

export class UpdateWarehouseDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
