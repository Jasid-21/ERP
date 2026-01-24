import { Module } from '@nestjs/common';
import { HeadquartersService } from './headquarters.service';
import { HeadquartersController } from './headquarters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeadquarterEntity } from './entities/Headquarter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HeadquarterEntity])],
  providers: [HeadquartersService],
  controllers: [HeadquartersController],
})
export class HeadquartersModule {}
