import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from 'src/modules/companies/entities/Company.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ name: 'is_email_verified' })
  isEmailVerified!: boolean;

  @ManyToMany(() => CompanyEntity, (company) => company.users)
  @JoinTable({
    name: 'companies_users',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'company_id',
      referencedColumnName: 'id',
    },
  })
  companies!: CompanyEntity[];
}
