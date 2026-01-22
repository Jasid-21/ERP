import { ProductEntity } from 'src/modules/products/entities/Product.entity';
import { WarehauseEntity } from 'src/modules/warehouses/entities/Warehause.entity';
import { AuditedEntity } from 'src/commons/classes/AuditedEntity.class';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'stock' })
@Unique(['productId', 'warehouseId'])
export class StockEntity extends AuditedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ProductEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @Column({ name: 'product_id' })
  productId!: number;

  @ManyToOne(() => WarehauseEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: WarehauseEntity;

  @Column({ name: 'warehouse_id' })
  warehouseId!: number;

  @Column({ type: 'int' })
  amount!: number;

  @Column({ name: 'alert_minimum', type: 'int', nullable: true })
  alertMinimum?: number;
}
