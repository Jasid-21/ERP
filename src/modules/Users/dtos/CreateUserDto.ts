import { IsEmail, IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsInt()
  companyId!: number;
}
