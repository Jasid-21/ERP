import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HeadquartersService } from './headquarters.service';
import { UpdateHeadquarterDto } from './dtos/UpdateHeadquarter.dto';
import { CreateHeadquarterDto } from './dtos/CreateHeadquarter.dto';

@Controller('headquarters')
export class HeadquartersController {
  constructor(private readonly headquartersService: HeadquartersService) {}

  @Get(':id')
  getHeadquarterById(@Param('id') id: number) {
    return this.headquartersService.findById(id);
  }

  @Post()
  createHeadquarter(@Body() dto: CreateHeadquarterDto) {
    return this.headquartersService.create(dto);
  }

  @Put(':id')
  updateHeadquarter(
    @Body() dto: UpdateHeadquarterDto,
    @Param('id') id: number,
  ) {
    return this.headquartersService.updateById(id, dto);
  }

  @Delete(':id')
  deleteHeadquarter(@Param('id') id: number) {
    return this.headquartersService.deleteHeadquarterById(id);
  }
}
