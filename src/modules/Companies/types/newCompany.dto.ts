import { IsOptional, IsString } from 'class-validator';

export class INewCompanyDto {
  @IsString()
  name!: string;

  @IsString()
  nit!: string;

  @IsString()
  rut!: string;

  @IsString()
  @IsOptional()
  digitalCertificate?: string;
}
