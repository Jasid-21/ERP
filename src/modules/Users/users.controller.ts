import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from './types/User.interface';
import { ICreateUserDto } from './types/CreateUserDto';
import { ILoginUser } from './types/LoginUser.interface';
import { JwtAuthGuard } from '../Auth/AuthGuard';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Get()
  async getUser(@Param('id') id: number): Promise<IUser> {
    return this._usersService.getUserById(id);
  }

  @Post()
  async createUser(@Body() dto: ICreateUserDto): Promise<IUser> {
    return this._usersService.createUser(dto);
  }

  @Post('login')
  async loginUser(@Body() dto: ILoginUser): Promise<string> {
    return this._usersService.loginUser(dto);
  }

  @Get('protected-route')
  @UseGuards(JwtAuthGuard)
  protectedRoute(): string {
    return 'Hola';
  }
}
