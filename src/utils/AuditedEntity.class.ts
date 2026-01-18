import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class AuditedEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'created_by', type: 'int' })
  createdBy: number;

  @Column({ name: 'updated_by', type: 'int', nullable: true })
  updatedBy: number;
}
