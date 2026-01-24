import { IsOptional, IsString } from 'class-validator';

export class UpdateHeadquarterDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
