import { IsInt } from 'class-validator';

export class UpdateByIdDto {
  @IsInt()
  id!: number;
}
