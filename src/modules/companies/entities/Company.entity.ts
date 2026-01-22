import { UserEntity } from 'src/modules/users/entities/User.entity';
import { AuditedEntity } from 'src/commons/classes/AuditedEntity.class';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'companies' })
export class CompanyEntity extends AuditedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  nit!: string;

  @Column()
  rut!: string;

  @ManyToMany(() => UserEntity, (user) => user.companies)
  users!: UserEntity[];
}
