import { AuditedEntity } from 'src/commons/classes/AuditedEntity.class';
import { ProductEntity } from 'src/modules/products/entities/Product.entity';
import { WarehouseEntity } from 'src/modules/warehouses/entities/Warehouse.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { movementType } from '../types/inventoryMovementTypes';
import { SaleEntity } from 'src/modules/sales/entities/Sale.entity';
import { PurchaseEntity } from 'src/modules/purchases/entities/Purchase.entity';

@Entity()
export class InventoryMovementEntity extends AuditedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ProductEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @Column({ name: 'product_id' })
  productId!: number;

  @ManyToOne(() => WarehouseEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse!: WarehouseEntity;

  @Column({ name: 'warehouse_id' })
  warehouseId!: number;

  @Column({ name: 'movement_type', type: 'enum', enum: movementType })
  movementType!: movementType;

  @Check(`"amount" > 0`)
  @Column({ type: 'int' })
  amount!: number;

  @Column()
  motive?: string;

  @Column({
    name: 'movement_date',
    type: 'timestamptz',
    default: () => 'now()',
  })
  movementDate!: Date;

  @ManyToOne(() => SaleEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'sale_id' })
  sale?: SaleEntity;

  @Column({ name: 'sale_id', nullable: true })
  saleId?: number;

  @ManyToOne(() => PurchaseEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'purchase_id' })
  purchase?: PurchaseEntity;

  @Column({ name: 'purchase_id', nullable: true })
  purchaseId?: number;
}
