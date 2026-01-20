import { IsString } from 'class-validator';

export class ILoginUser {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
