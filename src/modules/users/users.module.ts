import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/User.entity';
import { CompanyEntity } from 'src/modules/companies/entities/Company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CompanyEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
