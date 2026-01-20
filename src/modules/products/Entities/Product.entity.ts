import { AuditedEntity } from 'src/utils/AuditedEntity.class';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { productType } from '../types/productTypes';
import { CompanyEntity } from 'src/modules/Companies/entities/Company.entity';

@Entity()
export class ProductEntity extends AuditedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  serial!: string;

  @Column()
  name!: string;

  @Column()
  type!: productType;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  measurement?: number;

  @Column({ name: 'measurement_unit', nullable: true })
  measurementUnit?: string;

  @Column({ name: 'standard_code', nullable: true })
  standardCode?: string;

  @Column({ name: 'base_price', nullable: true })
  basePrice?: number;

  @ManyToOne(() => CompanyEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company!: CompanyEntity;

  @Column({ name: 'company_id' })
  companyId!: number;
}
