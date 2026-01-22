import { IsInt } from 'class-validator';

export class UpdateAmountDto {
  @IsInt()
  id!: number;

  @IsInt()
  amount!: number;
}
