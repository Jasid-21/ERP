import { AuditedEntity } from 'src/commons/classes/AuditedEntity.class';
import { Entity } from 'typeorm';

@Entity()
export class SaleEntity extends AuditedEntity {}
