import { AuditedEntity } from 'src/commons/classes/AuditedEntity.class';
import { CompanyEntity } from 'src/modules/companies/entities/Company.entity';
import { WarehouseEntity } from 'src/modules/warehouses/entities/Warehouse.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class HeadquarterEntity extends AuditedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  location?: string;

  @ManyToOne(() => CompanyEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company!: CompanyEntity;

  @Column({ name: 'company_id' })
  companyId!: number;

  @ManyToOne(() => WarehouseEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'default_warehouse_id' })
  defaultWarehouse?: WarehouseEntity;

  @Column({ name: 'default_warehouse_id', nullable: true })
  defaultWarehouseId?: number;
}
