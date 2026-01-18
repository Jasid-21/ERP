import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../types/User.interface';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'is_email_verified' })
  isEmailVerified: boolean;
}

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
