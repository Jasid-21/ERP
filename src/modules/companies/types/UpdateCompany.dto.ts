import { IsString } from 'class-validator';

export class IUpdateCompanyDto {
  @IsString()
  name!: string;

  @IsString()
  nit!: string;

  @IsString()
  rut!: string;
}
