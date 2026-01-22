import { CompanyEntity } from 'src/modules/companies/entities/Company.entity';
import { AuditedEntity } from 'src/commons/classes/AuditedEntity.class';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'warehouses' })
export class WarehauseEntity extends AuditedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => CompanyEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company!: CompanyEntity;

  @Column({ name: 'company_id' })
  companyId!: number;
}
