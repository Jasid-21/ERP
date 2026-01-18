import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, userEntityParser } from './entities/User.Entity';
import { Repository } from 'typeorm';
import { IUser } from './types/User.interface';
import { ICreateUserDto } from './types/CreateUserDto';
import { MatchObj, MatchProperty } from 'src/utils/MatchObj.class';
import * as bcrypt from 'bcrypt';
import { verifyPasswordRules } from 'src/utils/InputRulesMethods';
import { ILoginUser } from './types/LoginUser.interface';
import { JwtServiceCustom } from '../Auth/JwtService';
import { CompanyEntity } from 'src/Companies/entities/Company.entity';

@Injectable()
export class UsersService {
  jwtService = new JwtServiceCustom();

  constructor(
    @InjectRepository(UserEntity)
    private readonly _usersRepo: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly _companiesRepo: Repository<CompanyEntity>,
  ) {}

  async getUserById(id: number): Promise<IUser> {
    if (!id || isNaN(Number(id)) || id <= 0) throw new BadRequestException();

    const user: UserEntity | null = await this._usersRepo.findOneBy({ id });
    if (!user) throw new NotFoundException();

    return userEntityParser(user);
  }

  async createUser(dto: ICreateUserDto): Promise<IUser> {
    if (!dto) throw new BadRequestException();

    const matcher = new MatchObj(
      new MatchProperty('username', ['string']),
      new MatchProperty('email', ['string']),
      new MatchProperty('password', ['string']),
      new MatchProperty('companyId', [1]),
    );
    const match = matcher.compare(dto, true);
    if (!match) throw new BadRequestException();

    //Verificar que la contraseña siga las reglas;
    if (!verifyPasswordRules(dto.password))
      throw new BadRequestException(
        'La contraseña debe tener entre 8 y 16 caracteres, al menos una mayúscula, una minúscula, un número y un caracter espcial',
      );

    //Verificar si ya existe un usuario con ese email.
    const duplicated = await this._usersRepo.findOneBy({ email: dto.email });
    if (duplicated) throw new ConflictException();

    const company = await this._companiesRepo.findOneBy({ id: dto.companyId });
    if (!company) throw new NotFoundException('Empresa no encontrada');

    const hashedPassword = bcrypt.hashSync(dto.password, 10);
    const rawEntity = this._usersRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      companies: [company],
    });

    try {
      const savedEntity = await this._usersRepo.save(rawEntity);
      const parsedUser = userEntityParser(savedEntity);
      return parsedUser;
    } catch (err) {
      console.error(err);
      throw new BadRequestException();
    }
  }

  async loginUser(dto: ILoginUser): Promise<string> {
    if (!dto) throw new BadRequestException();

    const matcher = new MatchObj(
      new MatchProperty('username', ['string']),
      new MatchProperty('password', ['string']),
    );
    if (!matcher.compare(dto)) throw new BadRequestException();

    const user = await this._usersRepo.findOneBy({ username: dto.username });
    if (!user) throw new UnauthorizedException();

    const pwMatch = bcrypt.compareSync(dto.password, user.password);
    if (!pwMatch) throw new UnauthorizedException();

    return this.jwtService.sign({
      username: user.username,
      email: user.email,
      id: user.id,
    });
  }
}
