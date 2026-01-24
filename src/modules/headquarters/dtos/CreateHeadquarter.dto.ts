import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateHeadquarterDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  companyId!: number;
}
