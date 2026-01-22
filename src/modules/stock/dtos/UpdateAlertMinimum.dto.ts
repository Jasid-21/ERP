import { IsInt } from 'class-validator';

export class UpdateAlertMinimumDto {
  @IsInt()
  id!: number;

  @IsInt()
  alertMinimum!: number;
}
