import { AuditedEntity } from 'src/commons/classes/AuditedEntity.class';
import { CompanyEntity } from 'src/modules/companies/entities/Company.entity';
import { HeadquarterEntity } from 'src/modules/headquarters/entities/Headquarter.entity';
import { ProductEntity } from 'src/modules/products/entities/Product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CatalogEntity extends AuditedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ProductEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'sale_price' })
  salePrice!: number;

  @ManyToOne(() => HeadquarterEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'headquarter_id' })
  headquarter!: HeadquarterEntity;

  @Column({ name: 'headquarter_id' })
  headquarterId!: number;

  @ManyToOne(() => CompanyEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company!: CompanyEntity;

  @Column({ name: 'company_id' })
  companyId!: number;
}
