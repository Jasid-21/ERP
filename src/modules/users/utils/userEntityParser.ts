import { UserEntity } from '../entities/User.entity';
import { IUser } from '../types/User.interface';

export function userEntityParser(
  user: UserEntity,
  includePassword: boolean = false,
): IUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    password: includePassword ? user.password : '',
  };
}
