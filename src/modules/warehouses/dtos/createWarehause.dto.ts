import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateWarehauseDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  companyId!: number;
}
