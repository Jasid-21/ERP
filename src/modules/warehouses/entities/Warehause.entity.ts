import { CompanyEntity } from 'src/modules/Companies/entities/Company.entity';
import { AuditedEntity } from 'src/utils/AuditedEntity.class';
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
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => CompanyEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @Column({ name: 'company_id' })
  companyId: number;
}
